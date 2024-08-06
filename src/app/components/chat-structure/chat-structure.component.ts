import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { InteractionService } from 'src/app/services/interaction/interaction.service';
import { StocksService } from 'src/app/services/stocks/stocks.service';
import { ChatMessage } from 'src/app/types/chat-message.type';
import { Language } from 'src/app/types/language.type';
import { QuestionType } from 'src/app/types/question-type.type';

@Component({
  selector: 'app-chat-structure',
  templateUrl: './chat-structure.component.html',
  styleUrls: ['./chat-structure.component.css'],
})
export class ChatStructureComponent {
  chatMessages: ChatMessage[] = [
    {
      sentByClient: false,
      text: 'WELCOME_MESSAGE',
      optionsList: [],
      questionType: QuestionType.WELCOME,
    },
    {
      sentByClient: false,
      text: 'SELECT_STOCK_GROUP_MESSAGE',
      optionsList: this.getMainMenuList(),
      questionType: QuestionType.STOCKGROUP,
    },
  ];
  language: Language = this.interactionService.getLanguage();
  languages: Language[] = [
    { code: 'en', language: 'English', flag: 'assets/img/UK.png' },
    { code: 'ro', language: 'Romanian', flag: 'assets/img/RO.png' },
  ];
  lastSelectedGroup: string = '';
  messageFormControl = new FormControl();

  constructor(
    private stocksService: StocksService,
    private translate: TranslateService,
    private interactionService: InteractionService
  ) {}

  /**
   * Changes the current language of the app.
   */
  changeLanguage(language: Language) {
    if (language.code === 'en') {
      this.language = {
        code: 'ro',
        language: 'Romanian',
        flag: 'assets/img/RO.png',
      };
      localStorage.setItem('language', 'ro');
      this.translate.use(
        localStorage.getItem('language')
          ? localStorage.getItem('language')!.toString()
          : 'en'
      );
    } else {
      this.language = {
        code: 'en',
        language: 'English',
        flag: 'assets/img/UK.png',
      };
      localStorage.setItem('language', 'en');
      this.translate.use(
        localStorage.getItem('language')
          ? localStorage.getItem('language')!.toString()
          : 'en'
      );
    }
  }

  /**
   * On "Go Back" selection of the client, display the previous question.
   */
  displayPreviousQuestion() {
    let lastQuestionType =
      this.chatMessages[this.chatMessages.length - 2].questionType;
    switch (lastQuestionType) {
      case QuestionType.STOCKITEM:
        for (let i = this.chatMessages.length - 1; i >= 0; i--) {
          if (this.chatMessages[i].questionType === QuestionType.STOCKGROUP) {
            this.chatMessages.push(this.chatMessages[i]);
            return;
          }
        }
        break;
      case QuestionType.STOCKPRICE:
        for (let i = this.chatMessages.length - 1; i >= 0; i--) {
          if (this.chatMessages[i].questionType === QuestionType.STOCKITEM) {
            this.chatMessages.push(this.chatMessages[i]);
            return;
          }
        }
        break;
    }
  }

  /**
   * Opens browser printing section.
   */
  exportChat() {
    let printReport = document.querySelector('.body')!.innerHTML;
    let printContainer = document.createElement('div');
    
    printContainer.innerHTML = printReport;
    document.body.appendChild(printContainer);
    Array.from(document.body.children).forEach((child) => {
      if (child !== printContainer) {
        (child as HTMLElement).style.display = 'none';
      }
    });
    window.print();
    document.body.removeChild(printContainer);
    Array.from(document.body.children).forEach((child) => {
      (child as HTMLElement).style.display = '';
    });
  }

  /**
   * On "Main menu" selection of the client, display the initial question (selection of stock exchange groups).
   * @returns list of stocks exchange from the JSON server (string[])
   */
  getMainMenuList(): string[] {
    let response: string[] = [];

    this.stocksService.getStocks().subscribe(
      (data) => {
        data.map((element: any) => response.push(element.stockExchange));
      },
      () => {
        response = [];
      }
    );

    return response;
  }

  /**
   * Get reply from the chatbot.
   */
  getReply(message: string) {
    if (
      this.chatMessages[this.chatMessages.length - 2].optionsList.includes(
        message
      )
    ) {
      if (message === 'OPTIONS.GO_BACK') {
        this.displayPreviousQuestion();
      }
      if (message === 'OPTIONS.MAIN_MENU') {
        this.chatMessages.push({
          sentByClient: false,
          text: 'SELECT_STOCK_ITEM_MESSAGE',
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
            newText = 'SELECT_STOCK_ITEM_MESSAGE';
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
                ? (newText = message + ': ' + element.price)
                : null
            );
            newQuestionType = QuestionType.STOCKPRICE;
            this.pushReplyToArray(newText, newOptionsList, newQuestionType);
          });

          break;
      }
    } else {
      this.chatMessages.push(this.chatMessages[this.chatMessages.length - 2]);
    }
    this.messageFormControl.setValue('');
  }

  /**
   * Addition of the new reply to the chat array of messages.
   */
  pushReplyToArray(
    newText: string,
    newOptionsList: string[],
    newQuestionType: QuestionType
  ) {
    newOptionsList.push('OPTIONS.MAIN_MENU');
    newOptionsList.push('OPTIONS.GO_BACK');
    this.chatMessages.push({
      sentByClient: false,
      text: newText,
      optionsList: newOptionsList,
      questionType: newQuestionType,
    });
  }

  /**
   * Check if the client answer matches the previous chatbot reply options and then call sendMessage to send the client message and retrieve a reply for it.
   */
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

  /**
   * Pushes client message and gets reply for it from the chatbot.
   */
  sendMessage() {
    this.chatMessages.push({
      sentByClient: true,
      text: this.messageFormControl.value,
      optionsList: [],
      questionType: QuestionType.NONE,
    });
    this.getReply(this.messageFormControl.value);
  }
}
