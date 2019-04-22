import { DialogflowSimpleResponseItem, DialogflowResponseSuggestion, DialogflowBasicCardItem } from './dialogflow-response';

export type SimpleSimpleResponsePayload = DialogflowSimpleResponseItem | DialogflowResponseSuggestion[];

export interface SimpleSimulatorResponse {
    type: string;
    payload: SimpleSimpleResponsePayload
}

export interface SimpleSimulatorInput {
    actor: number;
    invocation?: boolean;

    query?: string;
    suggestions?: DialogflowResponseSuggestion[];
    card?: DialogflowBasicCardItem;
}
export interface SimpleSimulatorOutput {
    query: string;
}
export enum SIMULATOR_ACTOR {
    ASSISTANT = 0,
    USER = 1
}

