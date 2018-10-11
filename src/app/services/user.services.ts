import { Injectable } from '@angular/core';
// import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from "rxjs/operators";
import { Router } from "@angular/router";
import { Observable} from 'rxjs/Observable';
// import { map, catchError } from 'rxjs/operators';

import 'rxjs/Rx';
//import { GLOBAL } from './global';

import { User } from '../models/user';
import swal from 'sweetalert';
import { throwError } from 'rxjs/internal/observable/throwError';
import { environment } from '../../environments/environment';


@Injectable()
export class UserService {
  public url: String;

  constructor(public _http: HttpClient, public router: Router) {
    this.url = environment.url;
    //this.url = GLOBAL.url;
  }

  prueba() {
    console.log("se ha presionado el botón de registro");
    return "Hola mundo";
  }

  /**
   * Método de servicio que permite registrar un nuevo usuario en la base de datos del sistema
   * @method register
   * @param  user     Datos del usuario
   * @return          Status de la petición
   */
  register(user: User) {
    console.log("Se registra usuario.");
    const body = JSON.stringify(user);
    const params = "json=" + body;
    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: this.getToken()
    });
    return this._http.post(this.url + "register", params, { headers }).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(error => {
        this.router.navigate(["/login"]);
        swal("Error", "Detalle: " + error.error.text, "error");
        return throwError(error);
      })
    );
  }

  update(user: User) {
    console.log("Se registra usuario.");
    const body = JSON.stringify(user);
    const params = "json=" + body;
    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: this.getToken()
    });
    return this._http
      .put(this.url + "usuarios/update/" + user.id, params, { headers })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(error => {
          this.router.navigate(["/login"]);
          swal("Error", "Detalle: " + error.error.text, "error");
          return throwError(error);
        })
      );
  }

  updatePassword(user: User) {
    console.log("Se actualiza password de usuario.");
    const body = JSON.stringify(user);
    const params = "json=" + body;
    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: this.getToken()
    });
    return this._http
      .put(this.url + "usuarios/updatePassword/" + user.id, params, { headers })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(error => {
          this.router.navigate(["/login"]);
          swal("Error", "Detalle: " + error.error.text, "error");
          return throwError(error);
        })
      );
  }

  delete(userId) {
    console.log("Se elimina usuario.");
    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: this.getToken()
    });
    return this._http.delete(this.url + "usuarios/delete/" + userId, { headers })
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError(error => {
          this.router.navigate(["/login"]);
          swal("Error", "Detalle: " + error.error.text, "error");
          return throwError(error);
        })
      );
  }

  obtenerUsuarios() {
    console.log("Se obtienen los usuarios registrados");
    const headers = new HttpHeaders({ Authorization: this.getToken() });
    const URL = this.url + "usuarios/list";
    return this._http.get(URL, { headers }).pipe(
      map((resp: any) => {
        return resp;
      }),
      catchError(error => {
        this.router.navigate(["/login"]);
        swal("Error", "Detalle: " + error.error.text, "error");
        return throwError(error);
      })
    );
  }

  /**
   * Método de servicio que se utiliza para identificar si un usuario esta registrado en el sistema
   * @method signup
   * @param  user   Email, password y flag para saber si se requiere el token o los datos del usuario
   * @return        Token | Datos del usuario
   */
  signup(user: User) {
    const body = JSON.stringify(user);
    const params = "json=" + body;
    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });
    return this._http
      .post(this.url + "login", params, { headers })
      .map((res: any) => {
        return res;
      });
  }

  getIDentity() {
    const identity = JSON.parse(localStorage.getItem("usuarioRegistrado"));
    if (identity !== "undefined") {
      return identity;
    } else {
      return null;
    }
  }

  getToken() {
    const token = localStorage.getItem("token");
    if (token !== "undefined") {
      return token;
    } else {
      return null;
    }
  }
}
