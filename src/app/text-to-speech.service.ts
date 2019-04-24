import { Injectable, Inject } from '@angular/core';
import { BackendApiService } from './backend-api.service';
import { of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TextToSpeechQueue } from './text-to-speech-queue';

const SIMULATE_AUDIO_TEST_MILLISECONDS: number = -1;
@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  public audio: HTMLAudioElement;
  public muted: boolean = false;
  public playing: boolean = false;
  urlMap: any = {};

  constructor(private backendApiService: BackendApiService) { }

  getQueue() {
    return new TextToSpeechQueue(this);
  }
  sound(on: boolean) {
    if (this.audio) {
      this.audio.muted = !on;
    }
    this.muted = !on;
  }

  playAudio(requestId: string, tts: string): Promise<any> {

    return new Promise((resolve, reject) => {
      if (SIMULATE_AUDIO_TEST_MILLISECONDS > 0) {
        setTimeout(() => {
          console.log(`SIMULATING AUDIO TEST ${SIMULATE_AUDIO_TEST_MILLISECONDS} MS`)
          resolve(requestId);
        }, SIMULATE_AUDIO_TEST_MILLISECONDS);
      } else {
        this.getAudioUrl(tts).then((result: any) => {
          if (result.url) {
            this.audio = new Audio();
            const audio = this.audio;
            audio.muted = this.muted;
            audio.src = result.url;
            audio.load();
            audio.play();
            this.playing = true;
            const c = this;
            audio.onended = () => {
              c.playing = false;
              resolve(requestId);
            }
          } else {
            reject("AUDIO URL NOT FOUND");
          }
        }).catch((err: any) => {
          reject(err);
        })
      }
    })
  }
  async getAudioUrl(ssml: string): Promise<any> {
    if (this.urlMap[ssml]) {
      return Promise.resolve({ url: this.urlMap[ssml], cached: true })
    }
    return this.backendApiService.postTextToSpeech(ssml)
      .pipe(
        tap((result: any) => {
          if (result.url) {
            this.urlMap[ssml] = result.url;
          }
        }),
        catchError((err: any) => {
          return of(null)
        })
      ).toPromise();
  }

}
