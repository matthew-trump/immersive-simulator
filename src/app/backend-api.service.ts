import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators'
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { ErrorMessageService } from './error-message.service';
import { TestApiResponse } from './test-api-response';
import { DialogflowSession } from './dialogflow-session';
import { DialogflowRequest } from './dialogflow-request';
import { DialogflowResponse } from './dialogflow-response';
import { GoogleAssistantRequest } from './google-assistant-request';

const BACKEND_URL: string = environment.server.url;
const API_PATH: string = environment.server.apiPath;
const LOGIN_PATH: string = environment.server.loginPath;
const CONFIG_PATH: string = environment.server.configPath;


@Injectable({
    providedIn: 'root'
})
export class BackendApiService {
    public target: string;

    constructor(
        public http: HttpClient,
        public errorMessageService: ErrorMessageService) { }

    login(username: string, password: string) {
        return this.http.post(BACKEND_URL + LOGIN_PATH, { username, password });
    }
    getBaseApiPath(): string {
        const url: string = BACKEND_URL;
        const apiPath: string = API_PATH;
        return url + apiPath;
    }
    getConfig(): Observable<any> {
        return this.http.get<any>(BACKEND_URL + CONFIG_PATH);
    }
    postToDialogflow(
        dialogflowRequest: DialogflowRequest,
        extra: any = {}): Observable<DialogflowResponse> {

        const obj: any = {
            target: this.target,
            projectId: dialogflowRequest.projectId,
            request: dialogflowRequest.assistantRequest,
            extra: extra
        }

        return this.http.post(this.getBaseApiPath() + "dialogflow", obj).pipe(
            tap((data: any) => {
                console.log(data);
                dialogflowRequest.session.user.setUserStorage(data.userStorage);
            }),
            catchError(err => {
                const message = err.error.error || err.message;
                this.errorMessageService.send("DialogflowService error: " + message);
                return of({ error: message });
            }),
            map(data => new DialogflowResponse(data))
        );
    }
    ping(): Observable<TestApiResponse> {
        return this.http.get<TestApiResponse>(this.getBaseApiPath() + 'ping');
    }
    protected(): Observable<TestApiResponse> {
        return this.http.get<TestApiResponse>(this.getBaseApiPath() + 'protected');
    }
    databasePing(value: string): Observable<TestApiResponse> {
        return this.http.post<TestApiResponse>(this.getBaseApiPath() + 'database/ping',
            { key: value });
    }
    databasePings(): Observable<TestApiResponse> {
        return this.http.get<TestApiResponse>(this.getBaseApiPath() + 'database/ping');
    }


}