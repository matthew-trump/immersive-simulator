import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleSimulatorComponent } from './simple-simulator.component';

describe('SimpleSimulatorComponent', () => {
  let component: SimpleSimulatorComponent;
  let fixture: ComponentFixture<SimpleSimulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleSimulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
