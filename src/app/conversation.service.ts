import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DialogflowResponse } from './dialogflow-response';


@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  response$: BehaviorSubject<DialogflowResponse> = new BehaviorSubject(null);
  responses: DialogflowResponse[] = [];

  constructor() {
    this.response$
      .pipe(
        tap((response: DialogflowResponse) => {
          if (!response) {
            this.responses = [];
          } else {
            console.log("onversationService RESPONSE", response)
            this.responses.unshift(response);
          }
        })
      ).subscribe();

  }
}
