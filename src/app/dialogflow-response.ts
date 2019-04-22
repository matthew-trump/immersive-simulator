export enum ITEM_TYPES {
    IMMERSIVE = "immersive",
    SIMPLE = "simple",
    BASIC_CARD = "basic_card"
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
export class DialogflowBasicCardItem {
    readonly type: string = ITEM_TYPES.BASIC_CARD;
    title: string;
    image: any;
    imageDisplayOptions: string;

    constructor(basicCard: any) {
        this.title = basicCard.title;
        this.image = basicCard.image;
        this.imageDisplayOptions = basicCard.imageDisplayOptions;
    }
}
export interface DialogflowResponseSuggestion {
    title: string;
}

export class DialogflowResponse {
    requestId: number;
    body: any;
    error: string;
    items: DialogflowResponseItem[];
    suggestions: DialogflowResponseSuggestion[]
    intent: string;


    constructor(data: any) {
        if (data) {
            this.requestId = data.requestId;
            if (!data.error) {
                this.body = data.response;
                this.intent = this.body.responseMetadata.queryMatchInfo.intent;
                this.items = this.body.expectedInputs[0].inputPrompt.richInitialPrompt.items
                    .map((item: any) => {
                        if (item) {
                            if (typeof item.immersiveResponse !== 'undefined') {
                                return new DialogflowImmersiveResponseItem(item.immersiveResponse)
                            } else if (typeof item.simpleResponse !== 'undefined') {
                                return new DialogflowSimpleResponseItem(item.simpleResponse);
                            } else if (typeof item.basicCard !== 'undefined') {
                                return new DialogflowBasicCardItem(item.basicCard);
                            } else {
                                return null;
                            }
                        } else {
                            console.log("ERROR DialogflowResponse found null item from backend", data);
                        }

                    })
                    .filter((item: any) => item !== null);
                this.suggestions = this.body.expectedInputs[0].inputPrompt.richInitialPrompt.suggestions
            } else {
                this.error = data.error;
            }


        }
    }
}

