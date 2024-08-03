import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { StocksService } from 'src/app/services/stocks/stocks.service';
import { QuestionType } from 'src/app/types/question-type.type';

@Component({
  selector: 'app-chat-structure',
  templateUrl: './chat-structure.component.html',
  styleUrls: ['./chat-structure.component.css'],
})
export class ChatStructureComponent {
  messageFormControl = new FormControl();
  lastSelectedGroup: string = '';
  chatMessages: {
    sentByClient: boolean;
    text: string;
    optionsList: string[];
    questionType: QuestionType;
  }[] = [
    {
      sentByClient: false,
      text: "Hello! Welcome to LSEG. I'm here to help you.",
      optionsList: [],
      questionType: QuestionType.WELCOME,
    },
    {
      sentByClient: false,
      text: 'Please select a Stock Exchange.',
      optionsList: this.getMainMenuList(),
      questionType: QuestionType.STOCKGROUP,
    },
  ];

  constructor(private stocksService: StocksService) {}

  changeLanguage() {
    alert('Language changed');
  }

  exportChat() {
    alert('Chat exported');
  }

  sendMessage() {
    this.chatMessages.push({
      sentByClient: true,
      text: this.messageFormControl.value,
      optionsList: [],
      questionType: QuestionType.NONE,
    });
    this.getReply(this.messageFormControl.value);
  }

  getReply(message: string) {
    console.log(
      'this.chatMessages[this.chatMessages.length - 2].optionsList:' +
        this.chatMessages[this.chatMessages.length - 2].text
    );
    if (
      this.chatMessages[this.chatMessages.length - 2].optionsList.includes(
        message
      )
    ) {
      if (message === 'Go Back') {
        this.displayParentQuestion();
      }
      if (message === 'Main menu') {
        this.chatMessages.push({
          sentByClient: false,
          text: 'Please select a Stock Exchange.',
          optionsList: this.getMainMenuList(),
          questionType: QuestionType.STOCKGROUP,
        });
      }

      let newOptionsList: string[] = [];
      let newText: string = '';
      let newQuestionType: QuestionType = QuestionType.NONE;
      switch (this.chatMessages[this.chatMessages.length - 2].questionType) {
        case QuestionType.STOCKGROUP:
          this.lastSelectedGroup = message;
          this.stocksService.getStocks().subscribe((data) => {
            data.map((element: any) =>
              element.stockExchange === message
                ? element.topStocks.map((stock: any) =>
                    newOptionsList.push(stock.stockName)
                  )
                : null
            );
            newText = 'Please select a stock.';
            newQuestionType = QuestionType.STOCKITEM;
            this.pushReplyToArray(newText, newOptionsList, newQuestionType);
          });
          break;
        case QuestionType.STOCKITEM:
          this.stocksService.getStocks().subscribe((data) => {
            let tempStocks: any;

            data.map((element: any) =>
              element.stockExchange === this.lastSelectedGroup
                ? (tempStocks = element.topStocks)
                : null
            );
            tempStocks.map((element: any) =>
              element.stockName === message
                ? (newText =
                    'Stock Price of ' +
                    message +
                    ' is ' +
                    element.price +
                    '. Please select an option.')
                : null
            );
            newQuestionType = QuestionType.STOCKPRICE;
            this.pushReplyToArray(newText, newOptionsList, newQuestionType);
          });

          break;
        case QuestionType.STOCKPRICE:
          //
          break;
      }
    } else {
      this.chatMessages.push(this.chatMessages[this.chatMessages.length - 2]);
    }
    this.messageFormControl.setValue('');
  }

  displayParentQuestion() {
    let lastQuestionType =
      this.chatMessages[this.chatMessages.length - 2].questionType;
    switch (lastQuestionType) {
      case QuestionType.STOCKITEM:
          for(let i = this.chatMessages.length-1; i>=0; i--) {
            if(this.chatMessages[i].questionType === QuestionType.STOCKGROUP) {
              this.chatMessages.push(this.chatMessages[i]);
              return;
            }
          }
        break;
      case QuestionType.STOCKPRICE:
        for(let i = this.chatMessages.length-1; i>=0; i--) {
          if(this.chatMessages[i].questionType === QuestionType.STOCKITEM) {
            this.chatMessages.push(this.chatMessages[i]);
            return;
          }
        }
      break;
    }
  }

  getMainMenuList(): string[] {
    let response: string[] = [];

    this.stocksService.getStocks().subscribe((data) => {
      data.map((element: any) => response.push(element.stockExchange));
    });
    return response;
  }

  replyToMessage(event: any) {
    if (
      this.chatMessages[this.chatMessages.length - 1].optionsList.includes(
        event
      )
    ) {
      this.messageFormControl.setValue(event);
      this.sendMessage();
    }
  }

  pushReplyToArray(
    newText: string,
    newOptionsList: string[],
    newQuestionType: QuestionType
  ) {
    newOptionsList.push('Main menu');
    newOptionsList.push('Go Back');
    this.chatMessages.push({
      sentByClient: false,
      text: newText,
      optionsList: newOptionsList,
      questionType: newQuestionType,
    });
  }
}
