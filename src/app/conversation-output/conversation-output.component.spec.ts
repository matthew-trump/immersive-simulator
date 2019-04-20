import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationOutputComponent } from './conversation-output.component';

describe('ConversationOutputComponent', () => {
  let component: ConversationOutputComponent;
  let fixture: ComponentFixture<ConversationOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationOutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
