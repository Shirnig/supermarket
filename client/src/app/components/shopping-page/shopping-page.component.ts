import { Component, OnInit } from '@angular/core';
import { MainPageService } from "../../services/main-page.service";
import { Router } from "@angular/router";
import {NewProduct, Product} from "../../interfaces/shopping-page.interface";
import {UserData} from "../../interfaces/main-page.interface";


@Component({
  selector: 'app-shopping-page',
  templateUrl: './shopping-page.component.html',
  styleUrls: ['./shopping-page.component.css']
})
export class ShoppingPageComponent implements OnInit {
  private service;
  private router;
  toggled: String;
  productsByCategory: Array<Product>;
  admin_mode: any;
  new_product: NewProduct;


  constructor(service: MainPageService, router: Router) {
    this.service = service;
    this.router = router;
    this.toggled = '';
    this.productsByCategory = [];
    this.admin_mode = null;
    this.new_product = {category_id: undefined, img_path: "", name: "", price: null};
  }

  sendUsername(name:String){
    this.service.onLogin(name);
  }

  changeSidebar(){
    this.toggled ? this.toggled = '' : this.toggled = 'toggled';
  }

  checkAuthentication(){
    this.service.isAuthenticated().subscribe((data: UserData)=>{
      if(this.router.url.endsWith('/members') && data.user.is_admin ||
        this.router.url.endsWith('/admin') && !data.user.is_admin ||
        !data.action.details && !data.user.is_admin){
        this.router.navigate(['']);
      } else{this.sendUsername(data.user.first_name)}
    }, err => this.router.navigate(['']));
  }

  getProducts(products: Array<Product>){
    this.productsByCategory = products;
  }


  getNewProduct(product: NewProduct){
    this.new_product = product;
  }

  whichMode(){
    if (this.router.url.endsWith('/members')) {
      this.admin_mode = false;
    } else if (this.router.url.endsWith('/admin')) {
      this.admin_mode = true;
    }
  }

  ngOnInit() {
    this.whichMode();
    this.checkAuthentication()
  }

}
