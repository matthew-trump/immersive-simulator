import { Injectable } from '@angular/core';
import { BackendApiService } from './backend-api.service';
import { Store } from '@ngrx/store';
import { ConfigStateAction } from './config-state.action';


@Injectable({
    providedIn: 'root'
})
export class ConfigService {


    constructor(private backendApiService: BackendApiService,
        private store: Store<any>
    ) { }

    async loadConfig(): Promise<any> {
        try {
            const config: any = await this.backendApiService.getConfig().toPromise();
            this.store.dispatch(new ConfigStateAction({
                config: config
            }));
            return Promise.resolve(config);
        } catch (err) {
            Promise.resolve(null)
        }
    }

}

