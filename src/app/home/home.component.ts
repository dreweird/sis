import { Component, OnInit } from '@angular/core';
import { routeAnimations, AnimationsService } from '../_animations/index';
import { Router } from '@angular/router';
import { environment as env } from '@env/environment';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [routeAnimations]

})
export class HomeComponent implements OnInit {

  isProd = env.production;
  envName = env.envName;
  version = env.versions.app;

  menu: any[] = [
    {
      title: 'Dashboard',
      route: 'inventory'
    },
    {
      title: 'Issuance Logs',
      route: 'logs'
    }         
  ];

  navigationSideMenu = [
    ...this.menu,
    { title: 'Log-out', route: 'logout'}
  ];

  constructor(private router: Router, private animationService: AnimationsService) {
    this.animationService.updateRouteAnimationType(true, true);
   }

  ngOnInit() {
  }

    logout(){
      this.router.navigate(['']);
  }

}

