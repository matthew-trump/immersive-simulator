import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { ChildService } from './child.service';
import { DialogflowResponse, DialogflowResponseItem, DialogflowImmersiveResponseItem, ITEM_TYPES } from './dialogflow-response';

const START_URL: string = "/assets/assistant.html";

@Injectable({
  providedIn: 'root'
})
export class ImmersiveSimulatorService {

  url$: BehaviorSubject<string> = new BehaviorSubject(START_URL);
  response$: BehaviorSubject<DialogflowResponse> = new BehaviorSubject(null);
  message$: BehaviorSubject<any>;
  unsubscribe$: Subject<null> = new Subject();

  constructor(public childService: ChildService) {
    this.reset();

    this.response$
      .pipe(
        tap((response: DialogflowResponse) => {
          if (response) {
            console.log("ImmersiveSimulatorService RESPONSE", response);
            const items = response.items;
            items.forEach((item: DialogflowResponseItem) => {

              if (item.type === ITEM_TYPES.IMMERSIVE) {
                const immersiveResponse: DialogflowImmersiveResponseItem = (item as DialogflowImmersiveResponseItem);
                const url: string = immersiveResponse.loadImmersiveUrl;
                if (url) {
                  this.url$.next(url);
                }
                const updatedState: any = immersiveResponse.updatedState;
                if (this.message$) {
                  this.message$.next({
                    type: "payload",
                    requestId: "" + response.requestId,
                    data: updatedState
                  })
                }
              }
            })
          }
        })
      )
      .subscribe();

  }
  reset() {
    this.url$.next(START_URL);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.message$ = new BehaviorSubject(null);
    this.unsubscribe$ = new Subject();
  }
  loaded() {
    this.message$
      .pipe(
        tap((message: any) => {
          this.childService.sendMessage(message);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe()
  }

  onChildQuery(query: string) {

  }
  onChildTts(requestId: number, tts: string) {

  }

  handleResponse(response: DialogflowResponse) {

  }
}
