import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Order} from "../interfaces/order-page.interface";


@Injectable({
  providedIn: 'root'
})
export class OrderPageService {
  private http;
  createOrderEmitter = new EventEmitter();
  subCreateOrder: Subscription;

  constructor(http: HttpClient) {
    this.http = http;
  }

  createOrder(order: Order): Observable<any> {
    return this.http.put('http://localhost:4008/shopping/order', order);
  }

  onCreateOrder() {
    this.createOrderEmitter.emit();
  }


}

