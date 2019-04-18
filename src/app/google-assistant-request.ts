import { CONVERSATION_TYPE, ACTIONS_CAPABILITY } from './google-assistant';

interface GoogleAssitantRequestUser {
    userId: string;
    lastSeen: string;
    locale: string;
    userStorage: string;
}
interface GoogleAssistantRequestConversation {
    conversationId: string;
    conversationToken: string;
    type: CONVERSATION_TYPE;
}
interface GoogleAssistantRequestInputRawInput {
    inputType: string;
    query: string;
}
interface GoogleAssistantRequestInput {
    intent: string;
    rawInputs: GoogleAssistantRequestInputRawInput[];
    arguments: any[];
}
interface GoogleAssisantRequestCapabilities {
    capabilities: GoogleAssistantRequestCapability[]
}
interface GoogleAssistantRequestCapability {
    name: ACTIONS_CAPABILITY;
}

export interface GoogleAssistantRequest {
    user: GoogleAssitantRequestUser;
    conversation: GoogleAssistantRequestConversation;
    inputs: GoogleAssistantRequestInput[];
    surface: GoogleAssisantRequestCapabilities;
    isInSandbox: boolean;
    availableSurfaces: GoogleAssisantRequestCapabilities[];
    requestType: string;
}