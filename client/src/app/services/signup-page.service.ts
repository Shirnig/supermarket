import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {NewUser} from "../interfaces/signup-page.interface";


@Injectable({
  providedIn: 'root'
})
export class SignupPageService {
  private http;

  constructor(http: HttpClient) {
    this.http = http;
  }

  checkId(id: Number): Observable<any> {
    return this.http.post(`http://localhost:4008/shopping/entry/sign-up/check-id/${id}`);
  }

  checkEmail(email: String): Observable<any> {
    return this.http.post(`http://localhost:4008/shopping/entry/sign-up/check-email/${email}`);
  }

  createUser(user: NewUser): Observable<any> {
    return this.http.put('http://localhost:4008/shopping/entry/sign-up', user);
  }

}

