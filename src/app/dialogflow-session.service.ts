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

    session : DialogflowSession;

    constructor(){}

    getNewSession(user: DialogflowUser) : DialogflowSession {
        this.session = new DialogflowSession(user, this.generateIdString());
        return this.session;
    }
    getCurrentSession() : DialogflowSession{
        return this.session;
    }

    generateIdString() : string {
        const length = 16;
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-';
        let result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

}