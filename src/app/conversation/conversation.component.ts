import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogflowUser } from '../dialogflow-user';
import { DialogflowUserService } from '../dialogflow-user.service';
import { DialogflowUserOptions } from '../dialogflow-user-options';
import { DialogflowSession } from '../dialogflow-session';
import { ProjectConfigService } from '../project-config.service';
import { DialogflowService } from '../dialogflow.service';
import { DialogflowInvocationOptions } from '../dialogflow-invocation-options';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ProjectConfig } from '../project-config';
import { DialogflowSessionService } from '../dialogflow-session.service';
import { environment } from 'src/environments/environment';

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
  invoke() {
    this.dialogflowService.sendInvocation(this.project.id, "take me to " + this.project.name, {
      customStage: this.customStage
    }).toPromise()
      .then((response: any) => {
        console.log(response);
      })
      .catch(err => {
        console.log("ERROR", err);
      })
  }
  quit() {
    this.dialogflowSessionService.resetSession();
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
