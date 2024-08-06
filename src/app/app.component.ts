import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { initializeApp } from "firebase/app";
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'IvwChatbot';

  constructor(translate: TranslateService) {
    const firebaseConfig = environment.firebaseConfig;
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
