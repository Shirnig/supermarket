import { Component, OnInit } from '@angular/core';
import { ShoppingPageService } from "../../../services/shopping-page.service";
import {Category, NewProduct, Product} from "../../../interfaces/shopping-page.interface";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  private service;
  product: NewProduct;
  add_mode: Boolean;
  currentImg: any;
  categories: Array<Category>;
  clickedProductCategory: Category;
  clickedProductId: String;

  constructor(service: ShoppingPageService) {
    this.service = service;
    this.product = {name: '', category_id: {_id: '', category_name: ''}, price: null, img_path: ''};
    this.add_mode = true;
    this.currentImg = {};
    this.categories = [];
    this.clickedProductCategory = {_id: '', category_name: ''};
    this.clickedProductId = '';
  }

  setImg(img){
    this.currentImg = img;
    this.product.img_path = img.name;
  }

  createProduct(){
    let x = new FormData();
    x.append('img', this.currentImg);
    x.append('product', JSON.stringify(this.product));

    this.add_mode ? this.addProduct(x) : this.updateProduct(x);
  }

  addProduct(product: FormData){
    this.service.addProduct(product).subscribe(()=>{
      this.service.onAddEditProduct(this.product.category_id._id);
      this.emptyProductFields();
    }, err => console.log(err));
  }

  updateProduct(product: FormData){
    this.service.updateProduct(this.clickedProductId, product).subscribe(()=>{
      this.service.onAddEditProduct(this.clickedProductCategory._id);
      this.emptyProductFields();
    }, err => console.log(err));
  }

  emptyProductFields(){
    this.product = {name: '', category_id: {_id: '', category_name: ''}, price: null, img_path: ''};
    this.clickedProductCategory = {_id: '', category_name: ''};
    this.clickedProductId = '';
    this.currentImg = {};
    this.add_mode = true;
  }

  emptyInputFile(element){
    element.value = '';
  }

  getCategories(){
    this.service.getCategories().subscribe(({data})=>{
      this.categories = data;
    }, err => console.log(err));
  }


  subToPopulateProduct(){
    if (this.service.subPopulateProduct === undefined) {
      this.service.subPopulateProduct =
        this.service.populateProductEmitter.subscribe((product: Product) => {
          this.add_mode = false;
          this.product = {
            name: product.name,
            category_id: product.category_id,
            price: product.price,
            img_path: product.img_path
          };
          this.clickedProductCategory = {...product.category_id};
          this.clickedProductId = product._id;
        });
    }
  }

  ngOnInit() {
    this.subToPopulateProduct();
    this.getCategories();
  }

}
