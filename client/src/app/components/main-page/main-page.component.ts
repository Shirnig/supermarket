import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { MainPageService } from "../../services/main-page.service";
import { UserData, User, Action, Order, StoreInfo } from "../../interfaces/main-page.interface"

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  private router: Router;
  private service;
  user_data: UserData;
  info_data: StoreInfo;
  authenticated: Boolean;
  login_error: String;

  constructor(service: MainPageService, router: Router) {
    this.router = router;
    this.service = service;
    this.user_data = {action: undefined, user: undefined};
    this.info_data = {orders: null, products: null};
    this.authenticated = false;
    this.login_error = '';
  }

  login(user){
    this.service.makeLogin(user).subscribe((data: UserData)=>{
      if(data.user.is_admin){
        this.router.navigate(['/shopping/admin']);
      }
      this.sendUsername(data.user.first_name);
      this.user_data = data;
      this.authenticated = true;
    }, err => this.login_error = err.error);
  }

  sendUsername(name:String){
    this.service.onLogin(name);
  }

  getStoreInfo(){
    this.service.getStoreInfo().subscribe((data: StoreInfo)=>{
      this.info_data = data;
    }, err => null);
  }

  checkAuthentication(){
    this.service.isAuthenticated().subscribe((data: UserData)=>{
      this.authenticated = true;
      this.user_data = data;
      this.sendUsername(data.user.first_name);
    }, err => null);
  }

  subToLogout(){
    if (this.service.subLogout === undefined) {
      this.service.subLogout =
        this.service.makeLogout.subscribe(() => {
          this.authenticated = false;
          this.emptyUserData();
        });
    }
  }

  emptyUserData(){
    this.user_data = {action: undefined, user: undefined};
  }


  ngOnInit() {
    this.getStoreInfo();
    this.checkAuthentication();
    this.subToLogout();
  }

}
