import { Component, Input, OnInit } from '@angular/core';
import { DialogflowSimpleResponseItem } from '../dialogflow-response';
@Component({
  selector: 'conversation-output-simple-item',
  templateUrl: './conversation-output-simple-item.component.html',
  styleUrls: ['./conversation-output-simple-item.component.scss']
})
export class ConversationOutputSimpleItemComponent implements OnInit {

  @Input() item: DialogflowSimpleResponseItem;

  constructor() { }

  ngOnInit() {
  }
}
