import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { initializeApp } from "firebase/app";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'IvwChatbot';

  constructor(translate: TranslateService) {
    const firebaseConfig = {
      apiKey: "AIzaSyAgY7hSP5D2Aa0eh-dcb-FudrwXEBHC6yU",
      authDomain: "ivwchatbot.firebaseapp.com",
      projectId: "ivwchatbot",
      storageBucket: "ivwchatbot.appspot.com",
      databaseUrl: "https://ivwchatbot-default-rtdb.europe-west1.firebasedatabase.app/",
      messagingSenderId: "448574835108",
      appId: "1:448574835108:web:ed868993fad1f3a7fe9931"
    };
    const app = initializeApp(firebaseConfig);
    translate.addLangs(['en', 'ro']);
    translate.setDefaultLang('en');
    if(!localStorage.getItem('language')) {
      localStorage.setItem('language', 'en');
    }
    translate.use(
      localStorage.getItem('language') ? localStorage.getItem('language')!.toString() : 'en'
    );
  }
}
