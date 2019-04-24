import { Injectable, Inject } from '@angular/core';
//import { Store } from '@ngrx/store';
//import { DOCUMENT } from '@angular/common';
//import { tap } from 'rxjs/operators';
//import { WindowRefService } from './window-ref.service';

//import { ImmersiveSimulatorMessageAction } from './config-state.action';

//import { ProjectConfig } from './project-config';

@Injectable({
  providedIn: 'root'
})
export class ChildService {

  //project: ProjectConfig;

  constructor(
    //private windowRefService: WindowRefService,
    //private store: Store<any>,
    //@Inject(DOCUMENT) private document: any
  ) {
    /** 
  this.windowRefService.nativeWindow
    .addEventListener("message",
      this.receiveMessage.bind(this), false);
      */
  }
  /** 
  get child() {
    return this.document.getElementById('iframe') ?
      this.document.getElementById('iframe').contentWindow : null;
  }
  receiveMessage(event: MessageEvent) {
    //this.store.dispatch(new ImmersiveSimulatorMessageAction(event));
  }
  sendOutputTtsStatus(requestId: number, status: string) {
    if (!this.child) return;
    this.child.postMessage({
      type: "OutputTtsStatus",
      requestId: requestId,
      status: status
    }, "*");
  }
  sendMessage(message: any) {
    if (!this.child) return;
    console.log("CHILD SERVICE sendMessage", message);
    this.child.postMessage(message, "*");
  }
  */
}
