import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'audio-wave',
  templateUrl: './audio-wave.component.html',
  styleUrls: ['./audio-wave.component.scss']
})
export class AudioWaveComponent implements OnInit {

  @Input() active: boolean = true;
  @Input() numBars: number = 5;
  @Input() width: number = 3;
  @Input() gap: number = 2;

  bars: any[];
  constructor() { }

  ngOnInit() {
    this.bars = Array(this.numBars);
  }
  left(index: number) {
    return (index * (this.width + this.gap)) + "px";
  }
  animation(index: number) {
    return this.active ? 'audio-wave 1.5s infinite ease-in-out ' + (index * 200) + "ms" : null;
  }
}
