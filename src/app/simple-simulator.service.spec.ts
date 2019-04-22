import { TestBed } from '@angular/core/testing';

import { SimpleSimulatorService } from './simple-simulator.service';

describe('SimpleSimulatorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SimpleSimulatorService = TestBed.get(SimpleSimulatorService);
    expect(service).toBeTruthy();
  });
});
