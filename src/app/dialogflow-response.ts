export class DialogflowResponse {
    body: any;
    immersive: boolean;
    immersiveResponse: any;
    intent: string;
    error: string;

    constructor(data: any) {
        if (data) {
            if (!data.error) {
                this.body = data.response;
                this.intent = this.body.responseMetadata.queryMatchInfo.intent;
                if (this.body.expectedInputs) {
                    this.immersive = true;
                    this.immersiveResponse = this.body.expectedInputs[0].inputPrompt.richInitialPrompt.items[0].immersiveResponse;
                }
            } else {
                this.error = data.error;
            }


        }
    }
}

