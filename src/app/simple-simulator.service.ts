import { Injectable } from '@angular/core';
import { BehaviorSubject, of, from } from 'rxjs';
import { tap, catchError, switchMap, concatMap } from 'rxjs/operators';
import { SimpleSimulatorInput, SimpleSimulatorResponse, SimpleSimulatorOutput } from './simple-simulator';
import { DialogflowResponse, ITEM_TYPES, DialogflowResponseItem, DialogflowSimpleResponseItem, DialogflowResponseSuggestion, DialogflowBasicCardItem } from './dialogflow-response';
import { ProjectConfig } from './project-config';
import { TextToSpeechService } from './text-to-speech.service';
import { TextToSpeechQueue, TextToSpeechRequest } from './text-to-speech-queue';



@Injectable({
  providedIn: 'root'
})
export class SimpleSimulatorService {

  textToSpeechQueue: TextToSpeechQueue;

  readout: SimpleSimulatorInput[] = [];

  scroll$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  invocation$: BehaviorSubject<ProjectConfig> = new BehaviorSubject(null);
  query$: BehaviorSubject<string> = new BehaviorSubject(null);
  response$: BehaviorSubject<DialogflowResponse> = new BehaviorSubject(null);

  input$: BehaviorSubject<SimpleSimulatorInput> = new BehaviorSubject(null);

  //textToSpeech$: BehaviorSubject<TextToSpeechRequest> = new BehaviorSubject(null)

  textToSpeechCounter: number = 0;

  constructor(
    private textToSpeechService: TextToSpeechService
  ) {

    this.reset();

    this.invocation$
      .pipe(
        tap((project: ProjectConfig) => {
          if (project) {
            this.input$.next({
              invocation: true,
              actor: 1,
              query: "Take me to " + project.name
            } as SimpleSimulatorInput);
            this.input$.next({
              actor: 0,
              query: "OK taking you to " + project.name
            } as SimpleSimulatorInput)
          }
        })
      )
      .subscribe();

    this.query$
      .pipe(
        tap((query: string) => {
          if (query) {
            this.input$.next({
              actor: 1,
              query: query,
            } as SimpleSimulatorInput)
          }
        })
      )
      .subscribe();

    this.response$
      .pipe(
        tap((response: DialogflowResponse) => {
          if (response) {
            this.handleResponse(response);
          }
        })
      )
      .subscribe();

    this.input$
      .pipe(
        tap((input: SimpleSimulatorInput) => {
          if (input) {
            if (input.invocation) {
              this.readout = [];
            }
            this.readout.push(input);
            this.scroll$.next(true);
          }
        })
      )
      .subscribe();

  }

  handleResponse(response: DialogflowResponse) {
    const items: DialogflowResponseItem[] = response.items;
    items.forEach((item: DialogflowResponseItem) => {
      if (item.type === ITEM_TYPES.SIMPLE) {

        const simpleResponse: DialogflowSimpleResponseItem = (item as DialogflowSimpleResponseItem);

        const query: string = simpleResponse.displayText ?
          simpleResponse.displayText
          : simpleResponse.textToSpeech;

        if (simpleResponse.textToSpeech) {
          const requestId = this.textToSpeechCounter++;
          this.textToSpeechQueue.messages$.next({
            requestId: "" + requestId,
            speech: simpleResponse.textToSpeech
          } as TextToSpeechRequest);
        }

        this.input$.next({
          actor: 0,
          query: query
        } as SimpleSimulatorInput);

      } else if (item.type === ITEM_TYPES.BASIC_CARD) {
        const basicCard = (item as DialogflowBasicCardItem);
        this.input$.next({
          actor: 0,
          card: basicCard
        } as SimpleSimulatorInput);

      }
    })
    const suggestions: DialogflowResponseSuggestion[] = response.suggestions;
    if (suggestions) {
      this.input$.next({
        actor: 0,
        suggestions: suggestions
      } as SimpleSimulatorInput);
    }
  }
  reset() {
    if (this.textToSpeechQueue) {
      this.textToSpeechQueue.complete();
    }
    this.textToSpeechQueue = this.textToSpeechService.getQueue();
    this.readout = [];
  }

}
