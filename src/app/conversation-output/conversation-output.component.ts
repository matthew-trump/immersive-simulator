import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { ITEM_TYPES } from '../dialogflow-response';
import { ConversationService } from '../conversation.service';

@Component({
  selector: 'conversation-output',
  templateUrl: './conversation-output.component.html',
  styleUrls: ['./conversation-output.component.scss']
})
export class ConversationOutputComponent implements OnInit, OnDestroy {


  public ITEM_TYPES = ITEM_TYPES;

  //unsubscribe$: Subject<null> = new Subject();
  constructor(public conversationService: ConversationService) { }

  ngOnInit() {

  }
  ngOnDestroy() {
    //this.unsubscribe$.next();
    //this.unsubscribe$.complete();
  }

}
