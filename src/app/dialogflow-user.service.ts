import { Injectable } from '@angular/core';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
//import { ErrorMessageService } from './error-message.service';
import { BackendApiService } from './backend-api.service';
import { DialogflowRequest } from './dialogflow-request';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { BehaviorSubject } from 'rxjs';
import { DialogflowUser } from './dialogflow-user';
import { DialogflowUserOptions } from './dialogflow-user-options';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DialogflowUserService {

    user: DialogflowUser;
    users: DialogflowUser[] = [];

    constructor() {
        if (environment.users) {
            this.users = environment.users.map(
                (options: DialogflowUserOptions) => {
                    console.log(options);
                    return new DialogflowUser(options.id, options)
                }
            );
            if (this.users.length > 0) {
                this.user = this.users[0];
            }

        } else {
            this.users = [];
        }
        console.log("USERS", this.users);

    }

    getNewUser(options: DialogflowUserOptions) {
        this.user = new DialogflowUser(this.generateIdString(), options);
        return this.user;
    }
    getCurrentUser() {
        return this.user;
    }

    generateIdString() {
        const length = 16;
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-';
        let result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }




}