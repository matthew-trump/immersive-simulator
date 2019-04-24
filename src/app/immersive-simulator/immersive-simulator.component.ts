import { Component, OnInit } from '@angular/core';
import { ImmersiveSimulatorService } from '../immersive-simulator.service';
import { environment } from '../../environments/environment';



@Component({
  selector: 'immersive-simulator',
  templateUrl: './immersive-simulator.component.html',
  styleUrls: ['./immersive-simulator.component.scss']
})
export class ImmersiveSimulatorComponent implements OnInit {

  iframe: any = {
    height: 700,
    width: 400
  };

  constructor(public immersiveSimulator: ImmersiveSimulatorService) { }

  ngOnInit() {
  }
  iframeLoaded() {
    console.log("IFRAME LOADED");
  }

}
