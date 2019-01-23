import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';


@Injectable()
export class DocumentService {

    

    //apiRoot: string = "http://localhost:8000";
    apiRoot: string = "http://172.16.130.8:3200";

    constructor(private http: Http) { }



    getItem(code){
        let body = {code: code};
        let url = `${this.apiRoot}/item`;
        return this.http.post(url, body).map(response => response.json());
    }
    

    addItem(item){
        let url = `${this.apiRoot}/additem`;
        return this.http.post(url, item).map(res => res.json());
    }

    issueDetails(id, loc){
        let url = `${this.apiRoot}/issuedetails`;
        let body = {id: id, loc: loc};
        return this.http.post(url, body).map(res => res.json());  
    }

    addIssue(issue){
        let url = `${this.apiRoot}/addissue`;
        return this.http.post(url, issue).map(res => res.json());    
    }

    issueLogs(code){
        let body = {code: code};
        let url = `${this.apiRoot}/logs`;
        return this.http.post(url, body).map(response => response.json());
    }


    deleteItem(id) {
        let url = `${this.apiRoot}/delItem/${id}`;
        return this.http.delete(url).map(res => res.json()); 
    }

    deleteIssue(id) {
        let url = `${this.apiRoot}/delIssue/${id}`;
        return this.http.delete(url).map(res => res.json()); 
    }


}