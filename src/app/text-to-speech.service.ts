import { Injectable } from '@angular/core';
import { BackendApiService } from './backend-api.service';
import { tap } from 'rxjs/operators';

const SIMULATE_AUDIO_TEST_MILLISECONDS: number = 5000;
@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {
  public audio: HTMLAudioElement;
  urlMap: any = {};

  constructor(private backendApiService: BackendApiService) { }


  fromChild(requestId: number, tts: string): Promise<any> {
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
            audio.src = result.url;
            audio.load();
            audio.play();
            audio.onended = () => {
              resolve(requestId);
            }
          }
        }).catch((err: any) => {
          reject();
        })
      }
    })
  }

  playAudio(ssml: string) {
    this.getAudioUrl(ssml).then((result: any) => {
      console.log("SSML RESULT", result);
      if (result.url) {
        this.audio = new Audio();
        const audio = this.audio;
        audio.src = result.url;
        audio.load();
        audio.play();
        audio.onended = () => {
          console.log("AUDIO DONE PLAYING");
        }
      }
    }).catch((err: any) => {
      console.log("SSML ERROR", err);
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
        })
      ).toPromise();
  }

}
