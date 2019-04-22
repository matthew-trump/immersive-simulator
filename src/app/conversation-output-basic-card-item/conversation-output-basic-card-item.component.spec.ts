import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationOutputBasicCardItemComponent } from './conversation-output-basic-card-item.component';

describe('ConversationOutputBasicCardItemComponent', () => {
  let component: ConversationOutputBasicCardItemComponent;
  let fixture: ComponentFixture<ConversationOutputBasicCardItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationOutputBasicCardItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationOutputBasicCardItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
