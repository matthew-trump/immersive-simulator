import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { tap } from 'rxjs/operators';
import { WindowRefService } from './window-ref.service';
import { TextToSpeechService } from './text-to-speech.service';
import { DialogflowService } from './dialogflow.service';
import { DialogflowResponse, ITEM_TYPES, DialogflowResponseItem, DialogflowImmersiveResponseItem } from './dialogflow-response';
import { ProjectConfigService } from './project-config.service';
import { ProjectConfig } from './project-config';

@Injectable({
  providedIn: 'root'
})
export class ChildService {

  project: ProjectConfig;

  constructor(private windowRefService: WindowRefService,
    private dialogflowService: DialogflowService,
    private projectConfigService: ProjectConfigService,
    private textToSpeechService: TextToSpeechService,
    @Inject(DOCUMENT) private document: any) {

    this.windowRefService.nativeWindow.addEventListener("message", this.receiveMessage.bind(this), false);
    this.projectConfigService.project$
      .pipe(
        tap((project: ProjectConfig) => {
          this.project = project;
        })
      ).subscribe();
  }
  get child() {
    return this.document.getElementById('iframe') ? this.document.getElementById('iframe').contentWindow : null;
  }
  receiveMessage(event: MessageEvent) {
    if (event.data.type === 'send_text_query') {

      const query: string = event.data.query;
      this.dialogflowService.sendTextQuery(this.project.id, query)
        .subscribe(this.handleImmersiveResponse.bind(this));

    } else if (event.data.type === 'output_tts') {

      const requestId: number = event.data.requestId;
      const tts: string = event.data.tts;
      this.textToSpeechService.fromChild(requestId, tts)
        .then((requestId: number) => {
          this.child.postMessage({
            type: "OutputTtsStatus",
            requestId: requestId,
            status: 1
          }, "*");
        })
        .catch((err) => {
          console.log("CHILD SERVICE TTS ERROR", err);
          this.child.postMessage({
            type: "OutputTtsStatus",
            requestId: requestId,
            status: 0
          }, "*");
        });

    } else if (event.data.type === 'onUpdateDone') {

    } else if (event.data.type === 'onload') {

    } else if (event.data.type === 'exit') {

    }
  }

  handleImmersiveResponse(response: DialogflowResponse) {
    if (!this.child) return;
    const responseItem: DialogflowResponseItem = response.items[0];
    const updatedState: any = (responseItem as DialogflowImmersiveResponseItem).updatedState
    if (responseItem.type === ITEM_TYPES.IMMERSIVE) {
      this.child.postMessage({
        type: "payload",
        requestId: response.requestId,
        data: updatedState
      }, "*");
    }
  }
}
