import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import {Login} from "../../../interfaces/main-page.interface";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Output() outData: EventEmitter<Login> = new EventEmitter<Login>();
  @Input() inError;
  router: Router;
  login: Login;

  constructor(router: Router) {
    this.router = router;
    this.login = {email: "", password: ""};
  }


  makeLogin(){
    this.outData.emit(this.login);
  }


  ngOnInit() {

  }

}
