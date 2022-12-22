import { Injectable } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Injectable({
  providedIn: 'root'
})
export class InappbrowserService {

  constructor(
    private iab: InAppBrowser,
  ) { }


  openurl(url:string){
    const browser = this.iab.create(url);
  }

}
