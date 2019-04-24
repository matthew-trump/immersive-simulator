import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { DOCUMENT } from '@angular/common';
import { WindowRefService } from './window-ref.service';
import {
  DialogflowResponse,
  DialogflowResponseItem,
  DialogflowSimpleResponseItem,
  DialogflowImmersiveResponseItem,
  ITEM_TYPES
} from './dialogflow-response';
import { TextToSpeechService } from './text-to-speech.service';
import { TextToSpeechRequest, TextToSpeechQueue } from './text-to-speech-queue';
import { ImmersiveSimulatorAction } from './immersive-simulator.action';

const START_URL: string = "/assets/assistant.html";

@Injectable({
  providedIn: 'root'
})
export class ImmersiveSimulatorService {

  textToSpeechQueue: TextToSpeechQueue;

  url$: BehaviorSubject<string> = new BehaviorSubject(START_URL);
  response$: BehaviorSubject<DialogflowResponse> = new BehaviorSubject(null);
  message$: BehaviorSubject<any>;
  unsubscribe$: Subject<null> = new Subject();


  textToSpeechCounter: number = -1;

  constructor(
    public store: Store<any>,
    public windowRefService: WindowRefService,
    public textToSpeechService: TextToSpeechService,
    @Inject(DOCUMENT) private document: any) {

    this.windowRefService.nativeWindow
      .addEventListener("message",
        this.receiveMessage.bind(this), false);

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
              } else if (item.type === ITEM_TYPES.SIMPLE) {
                const simpleResponse: DialogflowSimpleResponseItem = (item as DialogflowSimpleResponseItem);
                if (simpleResponse.textToSpeech) {
                  const requestId = this.textToSpeechCounter--;
                  this.textToSpeechQueue.messages$.next({
                    requestId: "" + requestId,
                    speech: simpleResponse.textToSpeech
                  } as TextToSpeechRequest);
                }
              }


            })
          }
        })
      )
      .subscribe();

  }
  reset() {
    if (this.textToSpeechQueue) {
      this.textToSpeechQueue.complete();
    }
    this.textToSpeechQueue = this.textToSpeechService.getQueue();
    this.subscribeToTextToSpeechUpdate();

    this.url$.next(START_URL);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.message$ = new BehaviorSubject(null);
    this.unsubscribe$ = new Subject();
  }
  subscribeToTextToSpeechUpdate() {
    this.textToSpeechQueue.update$.subscribe((requestId: string) => {
      console.log("IMMERSIVE SIMULATOR textToSpeechQueue update", requestId);
      if (parseInt(requestId) > -1) {
        this.sendOutputTtsStatus(requestId, "END");
      }
    })
  }


  loaded() {
    this.message$
      .pipe(
        tap((message: any) => {
          this.sendMessage(message);
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe()
  }

  get child() {
    return this.document.getElementById('iframe') ?
      this.document.getElementById('iframe').contentWindow : null;
  }
  receiveMessage(event: MessageEvent) {
    if (event && event.data) {

      if (event.data.type === 'onload') {
        console.log("ImmersiveSimulator APP LOADED");
        this.loaded();

      } else if (event.data.type === 'send_text_query') {
        this.store.dispatch(new ImmersiveSimulatorAction("$any:" + event.data.query))

      } else if (event.data.type === 'output_tts') {

        const requestId: string = event.data.requestId;
        const tts: string = event.data.tts;

        this.textToSpeechQueue.messages$.next({
          requestId: requestId,
          speech: tts
        } as TextToSpeechRequest);

        /** 
        this.textToSpeechService.playAudio(requestId, tts)
          .then((requestId: string) => {
            this.sendOutputTtsStatus(requestId, "END");
          })
          .catch((err) => {
            console.log("IMMERSIVE SIMULATOR TTS ERROR", err);
            this.sendOutputTtsStatus(requestId, "END");
          });
          */
      } else if (event.data.type === 'onUpdateDone') {

      } else if (event.data.type === 'exit') {

      }
    }
  }
  sendOutputTtsStatus(requestId: string, status: string) {
    if (!this.child) return;
    this.child.postMessage({
      type: "OutputTtsStatus",
      requestId: requestId,
      status: status
    }, "*");
  }
  sendMessage(message: any) {
    if (!this.child) return;
    console.log("IMMERSIVE SIMULATOR sendMessage", message);
    this.child.postMessage(message, "*");
  }
}
