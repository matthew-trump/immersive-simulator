import { TestBed } from '@angular/core/testing';

import { ImmersiveSimulatorService } from './immersive-simulator.service';

describe('ImmersiveSimulatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImmersiveSimulatorService = TestBed.get(ImmersiveSimulatorService);
    expect(service).toBeTruthy();
  });
});
