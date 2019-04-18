import { Component } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { BackendApiService } from './backend-api.service';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';
import { ConfigService } from './config.service';
import { ProjectAction } from './config-state.action';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment'
import { ProjectConfigService } from './project-config.service';

const TITLE: string = 'Dialogflow Testing Tool';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  public title: string = TITLE;
  public config: any;
  public targets$: BehaviorSubject<string[]> = new BehaviorSubject(null);
  public projects$: BehaviorSubject<string[]> = new BehaviorSubject(null);
  public current: any = {
    targetName: null,
    projectName: null
  }
  constructor(
    public authService: AuthService,
    public backendApiService: BackendApiService,
    private configService: ConfigService,
    private projectConfigService: ProjectConfigService,
    private store: Store<any>,
    private titleService: Title,
    private router: Router) {

    this.titleService.setTitle(TITLE);
    this.store.select('config').subscribe((state: any) => {
      if (state.config) {
        const config: any = state.config;
        this.config = config;
        console.log("AppComponent CONFIG", config);
        this.targets$.next(Object.keys(config.targets));
        this.current.targetName = config.defaultTarget;
        this.backendApiService.target = this.current.targetName;

        if (this.current.targetName) {
          this.current.projectName = config.defaultProject;
          this.updateTarget();
          this.updateProject();
        }
      }
    })
    this.store.select('project').subscribe((state: any) => {
      if (state.project) {
        console.log("PROJECT", state.project);
        this.projectConfigService.project$.next(Object.assign({ id: state.project }, this.config.projects[state.project]));
      }
    })
    this.configService.loadConfig();
  }

  updateTarget() {
    console.log("SELECTION CHANGE TARGET", this.current.targetName);
    const target: any = this.config.targets[this.current.targetName];
    const projects: string[] = target.projects;
    this.projects$.next(projects);
    this.resetProject(projects);
  }
  updateProject() {
    console.log("SELECTION CHANGE PROJECT", this.current.projectName);
    this.store.dispatch(new ProjectAction(this.current.projectName));
  }

  resetProject(projects: string[]) {
    console.log("INDEX", this.current.projectName, projects.indexOf(this.current.projectName));
    if (this.current.projectName
      && (!projects || projects.indexOf(this.current.projectName) === -1)) {
      this.current.projectName = null;
      this.updateProject();
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }

}
