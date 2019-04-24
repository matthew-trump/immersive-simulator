//import { ConfigStateAction } from './config-state.action';
import { ACTIONS } from './actions';

const defaultState: any = {
    query: null
}
export function ImmersiveSimulatorReducer(state: any = defaultState, action: any): any {
    switch (action.type) {
        case ACTIONS.IMMERSIVE_SIMULATOR:
            return action.payload;
        default:
            return state;

    }
}
