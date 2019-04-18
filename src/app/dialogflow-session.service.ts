import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { ErrorMessageService } from './error-message.service';
import { BackendApiService } from './backend-api.service';
import { DialogflowRequest } from './dialogflow-request';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from '../environments/environment';

import { BehaviorSubject } from 'rxjs';
import { DialogflowUser } from './dialogflow-user';
import { DialogflowSession } from './dialogflow-session';

@Injectable({
    providedIn: 'root'
})
export class DialogflowSessionService {

    private session: DialogflowSession;

    constructor() { }

    getNewSession(user: DialogflowUser, customStage: boolean): DialogflowSession {
        console.log("CUSTOM STAGE", customStage)
        this.session = new DialogflowSession(user, this.generateIdString(), customStage);
        return this.session;
    }
    getCurrentSession(): DialogflowSession {
        return this.session;
    }
    resetSession(): void {
        this.session = null;
    }

    generateIdString(): string {
        const length = 16;
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-';
        let result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

}