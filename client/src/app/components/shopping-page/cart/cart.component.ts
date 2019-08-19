import { Component, OnInit } from '@angular/core';
import { ShoppingPageService } from "../../../services/shopping-page.service";
import { OrderPageService } from "../../../services/order-page.service";
import { Router } from "@angular/router";
import {Item} from "../../../interfaces/shopping-page.interface";

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  private router;
  private shoppingService;
  private orderService;
  cart_items: Array<Item>;
  total_cart_price: Number;
  shopping_mode: any;
  search_item: String;
  display_back_btn: Boolean;

  constructor(router: Router, shoppingService: ShoppingPageService, orderService: OrderPageService) {
    this.router = router;
    this.shoppingService = shoppingService;
    this.orderService = orderService;
    this.cart_items = [];
    this.total_cart_price = 0;
    this.shopping_mode = true;
    this.search_item = '';
    this.display_back_btn = true;
  }

  getCartItems(){
    this.shoppingService.getCartItems().subscribe(({cart})=>{
      this.cart_items = cart.data;
      this.total_cart_price = cart.metadata.total_cart_price;
    }, err => console.log(err));
  }

  deleteItem(product_id: String){
    this.shoppingService.deleteItem(product_id).subscribe(()=>{
      this.getCartItems();
    }, err => console.log(err));
  }

  deleteAllItems(){
    this.shoppingService.deleteAllItems().subscribe(()=>{
      this.getCartItems();
    }, err => console.log(err));
  }

  subToAddItem(){
    if (this.shoppingService.subAddItem === undefined) {
      this.shoppingService.subAddItem =
        this.shoppingService.addItemEmitter.subscribe(() => {
          this.getCartItems();
        });
    }
  }


  subToCreateOrder(){
    if (this.orderService.subCreateOrder === undefined) {
      this.orderService.subCreateOrder =
        this.orderService.createOrderEmitter.subscribe(() => {
          this.display_back_btn = false;
        });
    }
  }


  searchItem(item: String) {
    return item.toLowerCase().includes(this.search_item.toLowerCase());
  }

  navigateToOrder(){
    this.shopping_mode = false;
    this.router.navigate(['/order']);
  }

  setMode() {
    return this.router.url === '/shopping/members';
  }


  ngOnInit() {
    this.shopping_mode = this.setMode();
    this.getCartItems();
    this.subToAddItem();
    this.subToCreateOrder();
  }

}
