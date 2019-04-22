import { Component, Input, OnInit } from '@angular/core';
import { DialogflowBasicCardItem } from '../dialogflow-response';

@Component({
  selector: 'conversation-output-basic-card-item',
  templateUrl: './conversation-output-basic-card-item.component.html',
  styleUrls: ['./conversation-output-basic-card-item.component.scss']
})
export class ConversationOutputBasicCardItemComponent implements OnInit {

  @Input() item: DialogflowBasicCardItem;

  constructor() { }

  ngOnInit() {
  }

}
