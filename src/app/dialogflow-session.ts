
import { DialogflowUser } from './dialogflow-user';

export class DialogflowSession {

    public conversationToken: string = "[\"_actions_on_google\"]";
    constructor(
        public user: DialogflowUser,
        public conversationId: string,
        public customStage: boolean) { }
}   