import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

   // apiRoot: string = "http://localhost:8000";
    apiRoot: string = "http://172.16.130.8:3200";

    constructor(private http: Http) { }

    login(username, password){
        let url = `${this.apiRoot}/auth`;
        let body = { username, password };
        return this.http.post(url, body).map(res => res.json());
    }

     logout() {
        // remove user from local storage to log user out
        localStorage.clear();
  }

}