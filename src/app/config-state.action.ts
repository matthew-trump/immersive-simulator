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

export class ImmersiveSimulatorMessageAction implements Action {
    public readonly type: string = ACTIONS.IMMERSIVE_SIMULATOR_MESSAGE;
    public payload: any;

    constructor(event: MessageEvent) {
        this.payload = {
            event: event
        }
    }
}
