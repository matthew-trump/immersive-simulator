import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { DialogflowUserService } from '../dialogflow-user.service';
import { ProjectConfigService } from '../project-config.service';
import { DialogflowService } from '../dialogflow.service';
import { DialogflowSessionService } from '../dialogflow-session.service';
import { ConversationService, ConversationOptions } from '../conversation.service';
import { ProjectConfig } from '../project-config';
import { DialogflowUser } from '../dialogflow-user';
import { DialogflowUserOptions } from '../dialogflow-user-options';
import { DialogflowSession } from '../dialogflow-session';

import { environment } from 'src/environments/environment';

const ALLOW_CUSTOM_STAGE: boolean = environment.allowCustomStage;
const CUSTOM_STAGE_DEFAULT: boolean = environment.customStageDefault;
const SIMULATOR_ON_DEFAULT: boolean = environment.simulatorOnDefault;



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

  unsubscribe$: Subject<null> = new Subject();

  simulatorOn: boolean = SIMULATOR_ON_DEFAULT;

  constructor(
    public dialogflowService: DialogflowService,
    public dialogflowUserService: DialogflowUserService,
    public dialogflowSessionService: DialogflowSessionService,
    public projectConfigService: ProjectConfigService,
    public conversationService: ConversationService) { }

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
    this.conversationService.invoke({
      simulatorOn: this.simulatorOn,
      customStage: this.customStage,
      project: this.project
    } as ConversationOptions)
  }

  query(prompt: string, qText: string) {
    this.conversationService.query(prompt, qText);
  }
  quit() {
    this.conversationService.quit();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
