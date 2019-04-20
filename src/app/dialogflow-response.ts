export enum ITEM_TYPES {
    IMMERSIVE = "immersive",
    SIMPLE = "simple"
}
export interface DialogflowResponseItem {
    type: string;
}

export class DialogflowImmersiveResponseItem {
    readonly type: string = ITEM_TYPES.IMMERSIVE;
    loadImmersiveUrl: string;
    updatedState: any;
    constructor(immersiveResponse: any) {
        this.loadImmersiveUrl = immersiveResponse.loadImmersiveUrl;
        this.updatedState = immersiveResponse.updatedState;
    }

}
export class DialogflowSimpleResponseItem {
    readonly type: string = ITEM_TYPES.SIMPLE;
    textToSpeech: string;
    displayText: string;
    constructor(simpleResponse: any) {
        this.textToSpeech = simpleResponse.textToSpeech;
        this.displayText = simpleResponse.displayText;
    }
}

export class DialogflowResponse {
    body: any;
    error: string;
    items: DialogflowResponseItem[];
    intent: string;


    constructor(data: any) {
        if (data) {
            if (!data.error) {
                this.body = data.response;
                this.intent = this.body.responseMetadata.queryMatchInfo.intent;
                this.items = this.body.expectedInputs[0].inputPrompt.richInitialPrompt.items
                    .map((item: any) => {
                        if (typeof item.immersiveResponse !== 'undefined') {
                            return new DialogflowImmersiveResponseItem(item.immersiveResponse)
                        } else if (typeof item.simpleResponse !== 'undefined') {
                            return new DialogflowSimpleResponseItem(item.simpleResponse);
                        } else {
                            return null;
                        }
                    })
                    .filter((item: any) => item !== null);
            } else {
                this.error = data.error;
            }


        }
    }
}

