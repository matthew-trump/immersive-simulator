import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsmlFormattedComponent } from './ssml-formatted.component';

describe('SsmlFormattedComponent', () => {
  let component: SsmlFormattedComponent;
  let fixture: ComponentFixture<SsmlFormattedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsmlFormattedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsmlFormattedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
