import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SimpleSimulatorInput, SimpleSimulatorResponse, SimpleSimulatorOutput } from './simple-simulator';
import { DialogflowResponse, ITEM_TYPES, DialogflowResponseItem, DialogflowSimpleResponseItem, DialogflowResponseSuggestion, DialogflowBasicCardItem } from './dialogflow-response';
import { ProjectConfig } from './project-config';
@Injectable({
  providedIn: 'root'
})
export class SimpleSimulatorService {

  readout: any[] = [];

  scroll$: BehaviorSubject<boolean> = new BehaviorSubject(true);
  invocation$: BehaviorSubject<ProjectConfig> = new BehaviorSubject(null);
  query$: BehaviorSubject<string> = new BehaviorSubject(null);
  response$: BehaviorSubject<DialogflowResponse> = new BehaviorSubject(null);

  input$: BehaviorSubject<SimpleSimulatorInput> = new BehaviorSubject(null);

  //output$: BehaviorSubject<SimpleSimulatorOutput> = new BehaviorSubject(null);

  constructor() {

    this.invocation$
      .pipe(
        tap((project: ProjectConfig) => {
          if (project) {
            this.input$.next({
              invocation: true,
              actor: 1,
              query: "Take me to " + project.name
            });
            this.input$.next({
              actor: 0,
              query: "OK taking you to " + project.name
            })
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
            })
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
    const items = response.items;
    items.forEach((item: DialogflowResponseItem) => {
      if (item.type === ITEM_TYPES.SIMPLE) {

        const simpleResponse = (item as DialogflowSimpleResponseItem);

        const query = simpleResponse.displayText ?
          simpleResponse.displayText
          : simpleResponse.textToSpeech;

        this.input$.next({
          actor: 0,
          query: query
        });

      } else if (item.type === ITEM_TYPES.BASIC_CARD) {
        const basicCard = (item as DialogflowBasicCardItem);
        this.input$.next({
          actor: 0,
          card: basicCard
        });

      }
    })
    const suggestions: DialogflowResponseSuggestion[] = response.suggestions;
    if (suggestions) {
      this.input$.next({
        actor: 0,
        suggestions: suggestions
      });
    }
  }
  reset() {
    this.readout = [];
  }

}
