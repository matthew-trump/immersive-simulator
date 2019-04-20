import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationOutputImmersiveItemComponent } from './conversation-output-immersive-item.component';

describe('ConversationOutputImmersiveItemComponent', () => {
  let component: ConversationOutputImmersiveItemComponent;
  let fixture: ComponentFixture<ConversationOutputImmersiveItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConversationOutputImmersiveItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConversationOutputImmersiveItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
