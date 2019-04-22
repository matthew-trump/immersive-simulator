import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { DialogflowUserService } from '../dialogflow-user.service';
import { ProjectConfigService } from '../project-config.service';
import { DialogflowService } from '../dialogflow.service';
import { DialogflowSessionService } from '../dialogflow-session.service';
import { ConversationService } from '../conversation.service';
import { SimpleSimulatorService } from '../simple-simulator.service';
import { ImmersiveSimulatorService } from '../immersive-simulator.service';
import { ProjectConfig } from '../project-config';
import { DialogflowUser } from '../dialogflow-user';
import { DialogflowUserOptions } from '../dialogflow-user-options';
import { DialogflowSession } from '../dialogflow-session';
import { DialogflowResponse } from '../dialogflow-response';
import { environment } from 'src/environments/environment';

const ALLOW_CUSTOM_STAGE: boolean = environment.allowCustomStage;
const CUSTOM_STAGE_DEFAULT: boolean = environment.customStageDefault;
const SIMULATOR_ON_DEFAULT: boolean = environment.simulatorOnDefault;
const SAVE_SCRIPT_DEFAULT: boolean = environment.saveScriptDefault;


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
  saveScript: boolean = SAVE_SCRIPT_DEFAULT;


  unsubscribe$: Subject<null> = new Subject();

  simulatorOn: boolean = SIMULATOR_ON_DEFAULT;

  constructor(
    public dialogflowService: DialogflowService,
    public dialogflowUserService: DialogflowUserService,
    public dialogflowSessionService: DialogflowSessionService,
    public projectConfigService: ProjectConfigService,
    public coversationService: ConversationService,
    public simpleSimulator: SimpleSimulatorService,
    public immersiveSimulator: ImmersiveSimulatorService) { }

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
  invoke() {
    const customStage = this.customStage;

    this.sendInvocationToConversationOutput();
    this.sendInvocationToSimulator();

    this.dialogflowService.sendInvocation(this.project.id, "take me to " + this.project.name, {
      customStage: customStage
    }).toPromise()
      .then((response: DialogflowResponse) => {
        if (response) {
          this.sendResponseToConversationOutput(response);
          this.sendResponseToSimulator(response);
        }
      })
      .catch(err => {
        console.log("ConversationComopnent.invoke ERROR", err);
      })
  }

  sendInvocationToConversationOutput() {
    this.coversationService.response$.next(null);
  }
  sendResponseToConversationOutput(response: DialogflowResponse) {
    this.coversationService.response$.next(response);
  }
  sendInvocationToSimulator() {
    if (this.simulatorOn && !this.customStage) {
      this.simpleSimulator.invocation$.next(this.project);
    }
  }
  sendQueryToSimulator(query: string) {
    if (this.simulatorOn && !this.customStage) this.simpleSimulator.query$.next(query)
  }
  sendResponseToSimulator(response: DialogflowResponse) {
    if (this.simulatorOn) {
      if (this.customStage) {
        this.immersiveSimulator.response$.next(response);
      } else {
        this.simpleSimulator.response$.next(response);
      }
    }
  }

  query(prompt: string, qText: string) {
    if (prompt.startsWith('$') && !qText.trim()) return;

    this.sendQueryToSimulator(qText ? qText : prompt);

    this.dialogflowService.sendTextQuery(this.project.id, prompt + (qText ? (":" + qText.trim()) : ""))
      .toPromise()
      .then((response: DialogflowResponse) => {
        if (response) {
          this.sendResponseToConversationOutput(response);
          this.sendResponseToSimulator(response);
        }
      })
      .catch(err => {
        console.log("ConversationComopnent.query ERROR", err);
      })
  }
  quit() {

    this.dialogflowService.sendTextQuery(this.project.id, "quit").toPromise()
      .then((response: DialogflowResponse) => {
        this.sendResponseToConversationOutput(response)
        this.dialogflowSessionService.resetSession();
      })
      .catch(err => {
        console.log("ConversationComopnent.quit ERROR", err);
        this.dialogflowSessionService.resetSession();
      })
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
