import { Component, ChangeDetectionStrategy, Input, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap, takeUntil } from 'rxjs/operators';
import { DialogflowResponse, ITEM_TYPES, DialogflowResponseItem, DialogflowSimpleResponseItem } from '../dialogflow-response';
import { SimpleSimulatorResponse, SimpleSimulatorInput } from '../simple-simulator';
import { SimpleSimulatorService } from '../simple-simulator.service';

@Component({
  selector: 'simple-simulator',
  templateUrl: './simple-simulator.component.html',
  styleUrls: ['./simple-simulator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SimpleSimulatorComponent implements OnInit, OnDestroy {

  constructor(public simulator: SimpleSimulatorService) { }

  ngOnInit() { }

  getScrollTop(element) {
    return this.simulator.readout.length > 0 ? element.scrollHeight : 0;
  }
  ngOnDestroy() {
    console.log("ON DESTROY");
  }




}
