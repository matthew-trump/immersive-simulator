import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProjectConfig } from './project-config';

@Injectable({
  providedIn: 'root'
})
export class ProjectConfigService {

  project$: BehaviorSubject<ProjectConfig> = new BehaviorSubject(null);

  constructor() { }
}
