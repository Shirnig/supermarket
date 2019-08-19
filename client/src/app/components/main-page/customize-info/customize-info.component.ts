import { Component, OnInit, Input } from '@angular/core';
import { Router } from "@angular/router";
import { ShoppingPageService } from "../../../services/shopping-page.service";
import {Action, User, UserData} from "../../../interfaces/main-page.interface";

@Component({
  selector: 'app-customize-info',
  templateUrl: './customize-info.component.html',
  styleUrls: ['./customize-info.component.css']
})
export class CustomizeInfoComponent implements OnInit {
  @Input() inCustomizeInfo: UserData;
  private service;
  private router;
  user: User;
  action: Action;

  constructor(service: ShoppingPageService, router: Router) {
    this.service = service;
    this.router = router;
    this.user = {is_admin: false, _id: '', first_name: '', last_name: '', city: '', street: ''};
    this.action = {type: '', details: {}};
  }


  createCart(){
    this.service.createCart().subscribe(()=>{
      this.router.navigate(['/shopping/members']);
    }, err => console.log(err));
  }

  navigate(){
    if(this.user.is_admin){
      this.router.navigate(['/shopping/admin'])
    }else{
      if(this.action.type === 'Start Shopping'){
        this.createCart();
      }else{
        this.router.navigate(['/shopping/members']);
      }
    }
  }

  ngOnInit() {
    this.user = this.inCustomizeInfo.user;
    this.action = this.inCustomizeInfo.action;
  }

}
