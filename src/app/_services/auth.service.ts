import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class AuthService {

   // apiRoot: string = "http://localhost:8000";
    apiRoot: string = "http://172.16.130.8:3200";

    constructor(private http: HttpClient) { }

    login(username, password){
        let url = `${this.apiRoot}/auth`;
        let body = { username, password };
        return this.http.post(url, body);
    }

     logout() {
        // remove user from local storage to log user out
        localStorage.clear();
  }

}