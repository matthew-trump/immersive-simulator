export class DialogflowResponse {
    payload: any;
    constructor(data: any) {
        if (data && data.expectedInputs) {
            this.payload = data.expectedInputs[0].inputPrompt.richInitialPrompt.items[0];
        }
    }
}