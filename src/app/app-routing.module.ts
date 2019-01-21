import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_common/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { InventoryComponent } from './inventory/inventory.component';
import { LogsComponent } from './logs/logs.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', component: LoginComponent },
    {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'inventory', component: InventoryComponent, 

            },
            {
                path: 'logs', component: LogsComponent, 

            },

 
           
        ]
    },


    // otherwise redirect to home
   // { path: '**', redirectTo: '' }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule { }

export const routedComponents = [HomeComponent, InventoryComponent, LoginComponent, LogsComponent];