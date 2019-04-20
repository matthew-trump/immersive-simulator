import { Component, Input, OnInit } from '@angular/core';
import { DialogflowImmersiveResponseItem } from '../dialogflow-response';

@Component({
  selector: 'conversation-output-immersive-item',
  templateUrl: './conversation-output-immersive-item.component.html',
  styleUrls: ['./conversation-output-immersive-item.component.scss']
})
export class ConversationOutputImmersiveItemComponent implements OnInit {

  @Input() item: DialogflowImmersiveResponseItem;
  updatedStateProperties: string[];
  updatedStateSubproperties: any;
  constructor() { }

  ngOnInit() {
    if (this.item) {
      const updatedState = this.item.updatedState;
      this.updatedStateProperties = Object.keys(updatedState);
      this.updatedStateSubproperties = {};
      this.updatedStateProperties.map((propName: string) => {
        const property = updatedState[propName];
        if (typeof property === 'object') {
          this.updatedStateSubproperties[propName] = Object.keys(updatedState[propName]);
        }
      })
    }

  }

}
