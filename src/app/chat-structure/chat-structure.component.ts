import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-chat-structure',
  templateUrl: './chat-structure.component.html',
  styleUrls: ['./chat-structure.component.css']
})
export class ChatStructureComponent {
  messageFormControl = new FormControl();
  chatMessages: {sentByClient: boolean, text: string, optionsList: string[]}[] = [];

  changeLanguage(){
    alert('Language changed')
  }

  exportChat() {
    alert('Chat exported')
  }

  sendMessage() {
    this.chatMessages.push({sentByClient: true, text: this.messageFormControl.value, optionsList: []});
    this.messageFormControl.setValue('');
    this.getReply(this.messageFormControl.value);
  }

  getReply(message: string) {
    this.chatMessages.push({sentByClient: false, text: 'Reply', optionsList: ['Option 1', 'Option 2', 'Option 3']});
  }
}
