import { Action } from '@ngrx/store';
import { ACTIONS } from './actions';

export class ImmersiveSimulatorAction implements Action {
    public readonly type: string = ACTIONS.IMMERSIVE_SIMULATOR;
    public payload: any;

    constructor(query: string) {
        this.payload = {
            query: query
        }
    }
}