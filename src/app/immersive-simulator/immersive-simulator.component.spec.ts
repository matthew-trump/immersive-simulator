import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImmersiveSimulatorComponent } from './immersive-simulator.component';

describe('ImmersiveSimulatorComponent', () => {
  let component: ImmersiveSimulatorComponent;
  let fixture: ComponentFixture<ImmersiveSimulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImmersiveSimulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImmersiveSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
