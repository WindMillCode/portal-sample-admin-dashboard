import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router

const routes: Routes = [
    {
        path:'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule)
    },
    {
        path:'login',
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
    },
    {
        path: '',
        loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
      }
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
