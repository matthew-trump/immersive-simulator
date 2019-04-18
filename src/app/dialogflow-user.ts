import { DialogflowUserOptions } from './dialogflow-user-options'
export class DialogflowUser{

    public userStorage: string = JSON.stringify({ data: {} });

    constructor(public id: string, public options: DialogflowUserOptions){}

    get useCanvas() : boolean {
        return this.options.useCanvas;
    }
    get lastSeen() : string {
        return this.options.lastSeen;
    }
    get locale() : string {
        return this.options.locale;
    }

    setUserStorage(userStorage: string) {
        this.userStorage = userStorage;
    }
    
}