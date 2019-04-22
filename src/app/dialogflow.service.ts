import { Injectable } from '@angular/core';
import { ErrorMessageService } from './error-message.service';
import { BackendApiService } from './backend-api.service';
import { DialogflowRequest } from './dialogflow-request';
import { DialogflowInvocationOptions } from './dialogflow-invocation-options';
import { tap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { environment } from '../environments/environment';

import { DialogflowUserService } from './dialogflow-user.service';
import { DialogflowSessionService } from './dialogflow-session.service';
import { CONVERSATION_TYPE, ACTIONS_INTENT, INPUT_TYPE } from './google-assistant';
import { DialogflowSession } from './dialogflow-session';

@Injectable({
    providedIn: 'root'
})
export class DialogflowService {

    requestIdCounter: number = 0;

    constructor(private backendApiService: BackendApiService,
        private dialogflowUserService: DialogflowUserService,
        private dialogflowSessionService: DialogflowSessionService
    ) { }

    sendInvocation(projectId: string, text: string, options: DialogflowInvocationOptions) {
        return this.backendApiService.postToDialogflow(
            new DialogflowRequest(
                this.requestIdCounter++,
                projectId,
                this.dialogflowSessionService.getNewSession(this.dialogflowUserService.getCurrentUser(), options.customStage),
                CONVERSATION_TYPE.NEW,
                ACTIONS_INTENT.MAIN,
                INPUT_TYPE.KEYBOARD,
                text), options.extra);
    }
    sendTextQuery(projectId: string, text: string) {
        return this.backendApiService.postToDialogflow(
            new DialogflowRequest(
                this.requestIdCounter++,
                projectId,
                this.dialogflowSessionService.getCurrentSession(),
                CONVERSATION_TYPE.ACTIVE,
                ACTIONS_INTENT.TEXT,
                INPUT_TYPE.KEYBOARD,
                text));
    }


}