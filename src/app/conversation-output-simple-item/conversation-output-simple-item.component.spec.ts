import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationOutputSimpleItemComponent } from './conversation-output-simple-item.component';

describe('ConversationOutputSimpleItemComponent', () => {
  let component: ConversationOutputSimpleItemComponent;
  let fixture: ComponentFixture<ConversationOutputSimpleItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationOutputSimpleItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationOutputSimpleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
