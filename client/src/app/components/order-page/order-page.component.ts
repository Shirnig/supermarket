import { Component, OnInit } from '@angular/core';
import { MainPageService } from "../../services/main-page.service";
import { ShoppingPageService } from "../../services/shopping-page.service";
import { Router } from "@angular/router";
import {Item} from "../../interfaces/shopping-page.interface";
import {User, UserData} from "../../interfaces/main-page.interface";


@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css']
})

export class OrderPageComponent implements OnInit {
  private serviceMain;
  private serviceShopping;
  private router;
  user_details: User;
  cart_items: Array<Item>;
  total_cart_price: Number;



  constructor(serviceMain: MainPageService, serviceShopping: ShoppingPageService, router: Router) {
    this.serviceMain = serviceMain;
    this.serviceShopping = serviceShopping;
    this.router = router;
    this.user_details = {_id: "", city: "", first_name: "", is_admin: false, last_name: "", street: ""};
    this.cart_items = [];
    this.total_cart_price = 0;
  }

  sendUsername(name:String){
    this.serviceMain.onLogin(name);
  }

  checkAuthentication(){
    this.serviceMain.isAuthenticated().subscribe((data: UserData)=>{
      if(data.action.details && data.action.details.cart){
        this.sendUsername(data.user.first_name);
        this.user_details = data.user;
      }else{
        this.router.navigate([''])
      }
    }, err => this.router.navigate(['']));
  }

  getCartItems(){
    this.serviceShopping.getCartItems().subscribe(({cart})=>{
      this.cart_items = cart.data;
      this.total_cart_price = cart.metadata.total_cart_price;
    }, err => console.log(err));
  }


  ngOnInit() {
    this.checkAuthentication();
    this.getCartItems();
  }

}
