import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { ITEM_TYPES } from '../dialogflow-response';
import { DialogflowResponse } from '../dialogflow-response';

@Component({
  selector: 'conversation-output',
  templateUrl: './conversation-output.component.html',
  styleUrls: ['./conversation-output.component.scss']
})
export class ConversationOutputComponent implements OnInit, OnDestroy {

  @Input() response$: Observable<DialogflowResponse>;
  responses: DialogflowResponse[] = [];
  public ITEM_TYPES = ITEM_TYPES;

  unsubscribe$: Subject<null> = new Subject();
  constructor() { }

  ngOnInit() {
    this.response$
      .pipe(
        tap((response: DialogflowResponse) => {

          if (!response) {
            this.responses = [];
          } else {
            console.log("RESPONSE", response)
            this.responses.unshift(response);
            console.log("RESPONSES", this.responses);
          }
        }),
        takeUntil(this.unsubscribe$)
      ).subscribe();
  }
  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
