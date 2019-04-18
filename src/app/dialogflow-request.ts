import { DialogflowSession } from "./dialogflow-session";
import { GoogleAssistantRequest } from './google-assistant-request';

const INPUT_TYPE_KEYBOARD: String = "KEYBOARD";
const INPUT_TYPE_VOICE: String = "VOICE";

export class DialogflowRequest {

    constructor(
        public projectId: string,
        public session: DialogflowSession,
        public conversationType: string,
        public intent: string,
        public inputType: string,
        public query: string) { }

    get assistantRequest(): GoogleAssistantRequest {
        return this.getObject();
    }
    getObject(): GoogleAssistantRequest {
        const obj: any = {
            user: {
                userId: this.session.user.id,
                locale: this.session.user.locale,
                lastSeen: this.session.user.lastSeen,
                userStorage: this.session.user.userStorage
            },
            conversation: {
                conversationId: this.session.conversationId,
                conversationToken: this.session.conversationToken,
                type: this.conversationType //ACTIVE or NEW
            },
            inputs: [
                {
                    intent: this.intent,
                    rawInputs: [
                        {
                            inputType: this.inputType,
                            query: this.query
                        }
                    ],
                    arguments: [
                        {
                            "name": "text",
                            "rawText": this.query,
                            "textValue": this.query
                        }
                    ]
                }
            ],
            surface: {
                capabilities: [
                    {
                        name: "actions.capability.SCREEN_OUTPUT"
                    },
                    {
                        name: "actions.capability.MEDIA_RESPONSE_AUDIO"
                    },
                    {
                        name: "actions.capability.WEB_BROWSER"
                    },
                    {
                        name: "actions.capability.AUDIO_OUTPUT"
                    }
                ]
            },
            isInSandbox: true,
            availableSurfaces: [
                {
                    capabilities: [
                        {
                            name: "actions.capability.SCREEN_OUTPUT"
                        },
                        {
                            name: "actions.capability.WEB_BROWSER"
                        },
                        {
                            name: "actions.capability.AUDIO_OUTPUT"
                        }
                    ]
                }
            ],
            requestType: "SIMULATOR"
        }

        if (this.session.customStage) {
            obj.surface.capabilities.push({
                name: "actions.capability.CUSTOM_STAGE"
            });
        }

        if (obj.inputs[0].rawInputs[0].inputType === INPUT_TYPE_KEYBOARD) {
            obj.inputs[0].arguments = [
                {
                    "name": "text",
                    "rawText": this.query,
                    "textValue": this.query
                }
            ]
        } else if (obj.inputs[0].rawInputs[0].inputType === INPUT_TYPE_VOICE) {

        }
        return obj;
    }

}