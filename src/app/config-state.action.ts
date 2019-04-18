import { Action } from '@ngrx/store';
import { ACTIONS } from './actions';

export class ConfigStateAction implements Action {
    public readonly type: string = ACTIONS.CONFIG_STATE;
    public payload: any;

    constructor(obj: any) {
        this.payload = {
            config: obj.config
        }
    }
}

export class ProjectAction implements Action {
    public readonly type: string = ACTIONS.PROJECT;
    public payload: any;

    constructor(project: string) {
        this.payload = {
            project: project
        }
    }
}
