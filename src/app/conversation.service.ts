import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DialogflowResponse } from './dialogflow-response';

import { DialogflowUserService } from './dialogflow-user.service';
import { ProjectConfigService } from './project-config.service';
import { DialogflowService } from './dialogflow.service';
import { DialogflowSessionService } from './dialogflow-session.service';
import { SimpleSimulatorService } from './simple-simulator.service';
import { ImmersiveSimulatorService } from './immersive-simulator.service';
import { TextToSpeechService } from './text-to-speech.service';


import { ProjectConfig } from './project-config';

export interface ConversationOptions {
  simulatorOn: boolean;
  customStage: boolean;
  project: ProjectConfig
}

@Injectable({
  providedIn: 'root'
})
export class ConversationService {


  response$: BehaviorSubject<DialogflowResponse> = new BehaviorSubject(null);

  responses: DialogflowResponse[] = [];
  options: ConversationOptions;

  constructor(
    public store: Store<any>,
    public dialogflowService: DialogflowService,
    public dialogflowUserService: DialogflowUserService,
    public dialogflowSessionService: DialogflowSessionService,
    public projectConfigService: ProjectConfigService,
    public textToSpeechService: TextToSpeechService,
    public simpleSimulator: SimpleSimulatorService,
    public immersiveSimulator: ImmersiveSimulatorService) {

    this.response$
      .pipe(
        tap((response: DialogflowResponse) => {
          if (!response) {
            this.responses = [];
          } else {
            console.log("cnversationService RESPONSE", response)
            this.responses.unshift(response);
          }
        })
      ).subscribe();

    this.store.select('immersiveSimulator')
      .pipe(
        tap((state: any) => {
          if (state.query) {
            this.sendQuerytoDialogflow(state.query);
          }
        })
      ).subscribe();

  }

  invoke(options: ConversationOptions) {
    this.options = options;

    this.sendInvocationToConversationOutput();
    this.sendInvocationToSimulator();

    this.dialogflowService.sendInvocation(this.options.project.id, "take me to " + this.options.project.name, {
      customStage: this.options.customStage
    }).toPromise()
      .then((response: DialogflowResponse) => {
        if (response) {
          this.sendResponseToConversationOutput(response);
          if (response.items) {
            this.sendResponseToSimulator(response);
          } else {
            console.log("ConversationService.invoke ERROR", response);
          }
        }
      })
      .catch(err => {
        console.log("ConversationService.invoke ERROR", err);
      })
  }

  sendInvocationToConversationOutput() {
    this.response$.next(null);
  }
  sendResponseToConversationOutput(response: DialogflowResponse) {
    this.response$.next(response);
  }
  sendInvocationToSimulator() {
    if (this.options.simulatorOn && !this.options.customStage) {
      this.simpleSimulator.invocation$.next(this.options.project);
    }
  }
  sendQueryToSimulator(query: string) {
    if (this.options.simulatorOn && !this.options.customStage) this.simpleSimulator.query$.next(query)
  }
  sendResponseToSimulator(response: DialogflowResponse) {
    if (this.options.simulatorOn) {
      if (this.options.customStage) {
        this.immersiveSimulator.response$.next(response);
      } else {
        this.simpleSimulator.response$.next(response);
      }
    }
  }
  query(prompt: string, qText: string) {
    if (prompt.startsWith('$') && !qText.trim()) return;
    this.sendQueryToSimulator(qText ? qText : prompt);
    this.sendQuerytoDialogflow(prompt + (qText ? (":" + qText.trim()) : ""))
  }
  sendQuerytoDialogflow(query: string) {
    this.dialogflowService.sendTextQuery(this.options.project.id, query)
      .toPromise()
      .then((response: DialogflowResponse) => {
        if (response) {
          this.sendResponseToConversationOutput(response);
          if (response.items) {
            this.sendResponseToSimulator(response);
          } else {
            console.log("ConversationService query ERROR", response);
          }
        }
      })
      .catch(err => {
        console.log("ConversationService.query ERROR", err);
      })
  }


  quit() {
    this.immersiveSimulator.reset();
    this.dialogflowService.sendTextQuery(this.options.project.id, "quit").toPromise()
      .then((response: DialogflowResponse) => {
        this.sendResponseToConversationOutput(response);
        this.dialogflowSessionService.resetSession();
      })
      .catch(err => {
        console.log("ConversationService.quit ERROR", err);
        this.dialogflowSessionService.resetSession();
      })
  }

}

