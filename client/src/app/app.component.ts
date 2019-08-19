import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  username: String;

  constructor() {
    this.username = null;
  }

  onActivate(username){
    this.username = username;
  }

}

