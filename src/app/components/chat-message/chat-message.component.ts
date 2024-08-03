import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent {
  @Input() sentByClient: boolean = false;
  @Input() message: string = '';
  @Input() optionsList: string[] = [];
  
  @Output() selectedOption = new EventEmitter<string>();
  
  selectOption(option: string){
    this.selectedOption.emit(option);
  }
}
