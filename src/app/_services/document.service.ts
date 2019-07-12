import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class DocumentService {

    

    //apiRoot: string = "http://localhost:8000";
    apiRoot: string = "http://172.16.130.8:3200";

    constructor(private http: HttpClient) { }



    getItem(code){
        let body = {code: code};
        let url = `${this.apiRoot}/item`;
        return this.http.post(url, body);
    }
    

    addItem(item){
        let url = `${this.apiRoot}/additem`;
        return this.http.post(url, item);
    }

    issueDetails(id, loc){
        let url = `${this.apiRoot}/issuedetails`;
        let body = {id: id, loc: loc};
        return this.http.post(url, body);
    }

    addIssue(issue){
        let url = `${this.apiRoot}/addissue`;
        return this.http.post(url, issue);  
    }

    issueLogs(code){
        let body = {code: code};
        let url = `${this.apiRoot}/logs`;
        return this.http.post(url, body);
    }


    deleteItem(id) {
        let url = `${this.apiRoot}/delItem/${id}`;
        return this.http.delete(url);
    }

    deleteIssue(id) {
        let url = `${this.apiRoot}/delIssue/${id}`;
        return this.http.delete(url);
    }


}