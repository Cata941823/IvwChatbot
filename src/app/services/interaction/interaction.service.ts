import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InteractionService {
  private language = {
    code: localStorage.getItem('language')
      ? localStorage.getItem('language')!.toString()
      : 'en',
    language: 'English',
    flag: 'assets/img/UK.png',
  };

  constructor() {}

  /**
   * Sets the current language of the app.
   */
  public setLanguage(language: {
    code: string;
    language: string;
    flag: string;
  }) {
    this.language = language;
  }

  /**
   * Returns the current language of the app.
   */
  public getLanguage() {
    return this.language;
  }
}
