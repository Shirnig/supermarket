import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs/internal/Subscription';
import {Login} from "../interfaces/main-page.interface";


@Injectable({
  providedIn: 'root'
})
export class MainPageService {
  getUsername = new EventEmitter();
  makeLogout = new EventEmitter();
  subsVar: Subscription;
  subLogout: Subscription;
  private http;

  constructor(http: HttpClient) {
    this.http = http;
  }

  makeLogin(user: Login): Observable<any> {
    return this.http.post('http://localhost:4008/shopping/entry/login', user);
  }

  getStoreInfo(): Observable<any> {
    return this.http.get('http://localhost:4008/shopping/entry/info');
  }

  onLogin(name: String) {
    this.getUsername.emit(name);
  }

  isAuthenticated(): Observable<any> {
    return this.http.get('http://localhost:4008/shopping/entry/authenticated');
  }

  logout(): Observable<any> {
    return this.http.get('http://localhost:4008/shopping/entry/logout');
  }

  onLogout() {
    this.makeLogout.emit();
  }

}
