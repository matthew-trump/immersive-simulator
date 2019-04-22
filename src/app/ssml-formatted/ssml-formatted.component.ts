import { Component, Input, OnInit } from '@angular/core';
import { TextToSpeechService } from '../text-to-speech.service'

import { environment } from 'src/environments/environment';

const TEXT_TO_SPEECH: boolean = environment.textToSpeech;

@Component({
  selector: 'ssml-formatted',
  templateUrl: './ssml-formatted.component.html',
  styleUrls: ['./ssml-formatted.component.scss']
})
export class SsmlFormattedComponent implements OnInit {

  public textToSpeech: boolean = TEXT_TO_SPEECH;

  @Input() ssml: string;

  constructor(public textToSpeechService: TextToSpeechService) { }

  ngOnInit() {
  }
  playAudio() {
    console.log("PLAY AUDIO")
    this.textToSpeechService.playAudio(this.ssml);
  }
  foo() {
    console.log("FOO2");
  }

}
