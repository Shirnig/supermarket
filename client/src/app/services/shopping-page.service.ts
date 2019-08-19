import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import {NewItem, NewProduct} from "../interfaces/shopping-page.interface";



@Injectable({
  providedIn: 'root'
})
export class ShoppingPageService {
  private http;
  addItemEmitter = new EventEmitter();
  subAddItem: Subscription;
  addEditProductEmitter = new EventEmitter();
  subAddEditProduct: Subscription;
  populateProductEmitter = new EventEmitter();
  subPopulateProduct: Subscription;


  constructor(http: HttpClient) {
    this.http = http;
  }

  createCart(): Observable<any> {
    return this.http.put('http://localhost:4008/shopping/cart');
  }

  getCategories(): Observable<any> {
    return this.http.get('http://localhost:4008/shopping/product/categories');
  }

  getProductsByCategory(category_id: String): Observable<any> {
    return this.http.get(`http://localhost:4008/shopping/product/category/${category_id}`);
  }

  getCartItems(): Observable<any> {
    return this.http.get('http://localhost:4008/shopping/cart');
  }

  deleteItem(product_id: String): Observable<any> {
    return this.http.delete(`http://localhost:4008/shopping/cart/remove-item/${product_id}`);
  }

  deleteAllItems(): Observable<any> {
    return this.http.delete('http://localhost:4008/shopping/cart/empty-cart');
  }

  addItemToCart(item: NewItem): Observable<any> {
    return this.http.put('http://localhost:4008/shopping/cart/add-item', item);
  }

  onAddItem() {
    this.addItemEmitter.emit();
  }

  getProductByName(product_name: String): Observable<any> {
    return this.http.get(`http://localhost:4008/shopping/product/${product_name}`);
  }

  addProduct(product: NewProduct): Observable<any> {
    return this.http.put('http://localhost:4008/shopping/product/admin', product);
  }

  onAddEditProduct(category_id: String) {
    this.addEditProductEmitter.emit(category_id);
  }

  onPopulateProduct(product: FormData) {
    this.populateProductEmitter.emit(product);
  }

  updateProduct(id: String, product: FormData): Observable<any> {
    return this.http.patch(`http://localhost:4008/shopping/product/admin/${id}`, product);
  }


}

