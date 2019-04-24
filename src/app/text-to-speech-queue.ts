import { Subject, BehaviorSubject, of, from } from 'rxjs'
import { concatMap, catchError, takeUntil } from 'rxjs/operators';

import { TextToSpeechService } from './text-to-speech.service';

export interface TextToSpeechRequest {
    requestId: string,
    speech: string
}

export class TextToSpeechQueue {

    unsubscribe$: Subject<null> = new Subject();

    public messages$: BehaviorSubject<TextToSpeechRequest> = new BehaviorSubject(null)
    public update$: BehaviorSubject<string> = new BehaviorSubject(null);

    constructor(public textToSpeechService: TextToSpeechService) {

        this.messages$
            .pipe(
                takeUntil(this.unsubscribe$),
                concatMap((ttsRequest: TextToSpeechRequest) => {
                    if (ttsRequest) {
                        console.log("TextToSpeechQueue playing" + ttsRequest.speech);
                        return from(this.textToSpeechService.playAudio(ttsRequest.requestId, ttsRequest.speech));
                    }
                    return of(null);
                }),
                catchError((err: any) => {
                    console.log("TextToSpeechQueue TTS ERROR", err);
                    return of(null)
                })
            ).subscribe((requestId: string) => {
                console.log("TTS QUEUE DONE", requestId);
                this.update$.next(requestId);
            });
    }
    complete() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }



}