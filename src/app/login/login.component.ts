import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/index';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';

class user {
  username: string;
  password: string;
}


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {



  logUser: user;

  constructor(private authService: AuthService, private router: Router, public snackBar: MatSnackBar) { }

  login(){
    this.authService.login(this.logUser.username, this.logUser.password).subscribe(res=>{
      console.log(res);
      if(res.length){
        localStorage.setItem('currentUser', JSON.stringify(res[0].user_id));
        localStorage.setItem('name', JSON.stringify(res[0].username));
        localStorage.setItem('code', JSON.stringify(res[0].code));
        this.router.navigate(['/home', 'inventory']);
      }
      else{
        this.snackBar.open('Invalid username and password', 'Please try again', {
          duration: 2000,
        });
      }
    });
  }

  ngOnInit() {
    this.authService.logout();
    this.logUser = new user();
  }

}
