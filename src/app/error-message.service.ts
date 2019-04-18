import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { ErrorMessageService } from './error-message.service';
import { BackendApiService } from './backend-api.service';
import { DialogflowRequest } from './dialogflow-request';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from '../environments/environment';

import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ErrorMessageService {

    constructor(
        //private backendApiService: BackendApiService,
        //private errorMessageService : ErrorMessageService
    ) {

    }
    send(message: string) {
        console.log("ERROR MESSAGE", message);
    }
}