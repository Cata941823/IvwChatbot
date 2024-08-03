import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatStructureComponent } from './chat-structure.component';

describe('ChatStructureComponent', () => {
  let component: ChatStructureComponent;
  let fixture: ComponentFixture<ChatStructureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatStructureComponent]
    });
    fixture = TestBed.createComponent(ChatStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
