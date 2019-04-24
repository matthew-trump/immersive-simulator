//import { ConfigStateAction } from './config-state.action';
import { ACTIONS } from './actions';

const defaultState: any = {
    event: null
}
export function ImmersiveSimulatorMessageReducer(state: any = defaultState, action: any): any {
    switch (action.type) {
        case ACTIONS.IMMERSIVE_SIMULATOR_MESSAGE:
            return action.payload;
        default:
            return state;

    }
}
