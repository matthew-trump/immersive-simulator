import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogflowUser } from '../dialogflow-user';
import { DialogflowUserService } from '../dialogflow-user.service';
import { DialogflowUserOptions } from '../dialogflow-user-options';
import { DialogflowSession } from '../dialogflow-session';
import { ProjectConfigService } from '../project-config.service';
import { DialogflowService } from '../dialogflow.service';
import { DialogflowInvocationOptions } from '../dialogflow-invocation-options';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ProjectConfig } from '../project-config';
import { DialogflowSessionService } from '../dialogflow-session.service';
import { environment } from 'src/environments/environment';
import {
  DialogflowResponse,
} from '../dialogflow-response';

const ALLOW_CUSTOM_STAGE: boolean = environment.allowCustomStage;
const CUSTOM_STAGE_DEFAULT: boolean = environment.customStageDefault;

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {

  project: ProjectConfig;
  locales: string[] = ['en-US', 'en-GB', 'en-CA'];

  newUserDefaults: any = {
    locale: this.locales[0],
    returning: false,
  }
  newUser: boolean = false;
  allowCustomStage: boolean = ALLOW_CUSTOM_STAGE;
  customStage: boolean = ALLOW_CUSTOM_STAGE && CUSTOM_STAGE_DEFAULT;


  response$: BehaviorSubject<DialogflowResponse> = new BehaviorSubject(null);
  unsubscribe$: Subject<null> = new Subject();

  constructor(
    public dialogflowService: DialogflowService,
    public dialogflowUserService: DialogflowUserService,
    public dialogflowSessionService: DialogflowSessionService,
    public projectConfigService: ProjectConfigService) { }

  ngOnInit() {
    this.projectConfigService.project$
      .pipe(
        tap((project: ProjectConfig) => {
          this.project = project;
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe();
  }
  get session(): DialogflowSession {
    return this.dialogflowSessionService.getCurrentSession();
  }
  get user(): DialogflowUser {
    return this.dialogflowUserService.user;
  }
  set user(user: DialogflowUser) {
    this.dialogflowUserService.user = user;
  }
  get users(): DialogflowUser[] {
    return this.dialogflowUserService.users;
  }
  addUser(values: any) {
    console.log("NEW USER", values);
    const options: DialogflowUserOptions = {
      locale: values.locale,
      lastSeen: values.returning ? (new Date()).toISOString() : null
    };
    const user: DialogflowUser = this.dialogflowUserService.getNewUser(options);
    this.dialogflowUserService.user = user;
    this.dialogflowUserService.users.push(user);
    this.newUserDefaults.locale = values.locale;
    this.newUserDefaults.returning = values.lastSeen
    this.newUser = false;
    this.dialogflowSessionService.resetSession();
  }


  query(prompt: string, qText: string) {
    if (prompt.startsWith('$') && !qText.trim()) return;
    const query: string = prompt + (qText ? (":" + qText.trim()) : "");
    console.log("SEND TEXT QUERY", query);
    this.dialogflowService.sendTextQuery(this.project.id, query)
      .toPromise()
      .then((response: DialogflowResponse) => {
        if (response) {
          this.response$.next(response)
        }
      })
      .catch(err => {
        console.log("ERROR", err);
      })
  }

  invoke() {
    const customStage = this.customStage;
    this.response$.next(null);
    this.dialogflowService.sendInvocation(this.project.id, "take me to " + this.project.name, {
      customStage: customStage
    }).toPromise()
      .then((response: DialogflowResponse) => {
        if (response) {
          this.response$.next(response)
        }
      })
      .catch(err => {
        console.log("ERROR", err);
      })
  }
  /**
  parseResponse(response: DialogflowResponse) {
    const intent = response.intent;
    if (response.error) {
      this.output.unshift({
        error: response.error
      });
      console.log("ERROR response.immersiveResponse.loadImmersiveUrl not found.");
      //this.errorMessage = "ERROR response.immersiveResponse.loadImmersiveUrl not found.";
    } else{




    } 
    
    if (response.immersiveResponse) {
      const updatedState = response.immersiveResponse.updatedState;
      const updatedStateProperties = Object.keys(updatedState);
      const updatedStateSubproperties: any = {};
      updatedStateProperties.map((propName: string) => {
        const property = updatedState[propName];
        if (typeof property === 'object') {
          updatedStateSubproperties[propName] = Object.keys(updatedState[propName]);
        }
      })

      const entry: any = {
        immersive: true,
        intent: intent,
        loadImmersiveUrl: response.immersiveResponse.loadImmersiveUrl,
        updatedState: updatedState,
        updatedStateProperties: updatedStateProperties,
        updatedStateSubproperties: updatedStateSubproperties
      }
      this.output.unshift(entry);
    } else if (response.simpleResponse) {
      const entry: any = {
        immersive: false,
        intent: intent,
        textToSpeech: response.simpleResponse.textToSpeech,
        displayText: response.simpleResponse.displayText
      }
      this.output.unshift(entry);
    }

  }
   */
  quit() {
    this.response$.next(null);
    this.dialogflowSessionService.resetSession();
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
