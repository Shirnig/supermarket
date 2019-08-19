import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { ShoppingPageService } from "../../../services/shopping-page.service";
import {Category} from "../../../interfaces/shopping-page.interface";

@Component({
  selector: 'app-categories-bar',
  templateUrl: './categories-bar.component.html',
  styleUrls: ['./categories-bar.component.css']
})
export class CategoriesBarComponent implements OnInit {
  @Output() outProducts: EventEmitter<Array<any>> = new EventEmitter<Array<any>>();
  private service;
  categories: Array<Category>;
  search: String;

  constructor(service: ShoppingPageService) {
    this.service = service;
    this.categories = [];
    this.search = '';

  }

  getCategories(){
    this.service.getCategories().subscribe(({data})=>{
      this.categories = data;
      this.getProductsByCategory(data[0]._id);
    }, err => null);
  }

  getProductsByCategory(id: String){
    this.service.getProductsByCategory(id).subscribe(({data})=>{
      this.outProducts.emit(data);
    }, err => null)
  }

  searchProduct(product_name: String){
    if(product_name)
    this.service.getProductByName(product_name).subscribe(({data})=>{
      this.outProducts.emit(data);
    }, err => console.log(err))
  }

  subToAddEditProduct(){
    if (this.service.subAddEditProduct === undefined) {
      this.service.subAddEditProduct =
        this.service.addEditProductEmitter.subscribe((category_id: String) => {
          this.getProductsByCategory(category_id);
        });
    }
  }

  ngOnInit() {
    this.getCategories();
    this.subToAddEditProduct();
  }

}
