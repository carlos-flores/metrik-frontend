import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DefaultComponent } from './components/default/default.component';
import { MapaComponent } from './components/mapa/mapa.component';


const app_routes: Routes = [
  { path: "", component: DefaultComponent },
  { path: "home", component: DefaultComponent },
  { path: "login", component: LoginComponent },
  { path: "logout/:sure", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "facturas", component: MapaComponent },
  { path: "**", pathMatch: "full", redirectTo: "home" }
];

export const APP_ROUTES = RouterModule.forRoot(app_routes, { useHash: true });
