import { Component, OnInit, Input } from '@angular/core';
import { ShoppingPageService } from "../../../services/shopping-page.service";
import { Router } from "@angular/router";
import {Product} from "../../../interfaces/shopping-page.interface";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {
  @Input() inProducts: Array<Product>;
  @Input() inAdminMode: Boolean;
  private service;
  private router;
  amount: any;
  current_product: Product;


  constructor(service: ShoppingPageService, router: Router) {
    this.service = service;
    this.router = router;
    this.amount = 1;
    this.current_product = {_id: "", category_id: undefined, img_path: "", name: "", price: null};
  }


  getCurrentProduct(product: Product){
    this.current_product = product;
    this.service.onPopulateProduct(this.current_product);
  }


  decide = (action) => action === 'plus'? +1 : this.amount === 1? null : -1;

  updateAmount(action: String){
    if(this.amount >= 1)
    this.amount += this.decide(action);
  }

  addItem(product_id: String){
    const item = {product_id: product_id, amount: this.amount};
    this.service.addItemToCart(item).subscribe(()=>{
      this.service.onAddItem();
        this.amount = 1;
    }, err => {
      this.amount = 1
      //add error when product exists in cart already
    });
  }


  ngOnInit() {
  }

}
