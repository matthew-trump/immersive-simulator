//import { ConfigStateAction } from './config-state.action';
import { ACTIONS } from './actions';

const defaultState: any = {
    project: null,
}
export function ProjectReducer(state: any = defaultState, action: any): any {
    switch (action.type) {
        case ACTIONS.PROJECT:
            return action.payload;
        default:
            return state;

    }
}
