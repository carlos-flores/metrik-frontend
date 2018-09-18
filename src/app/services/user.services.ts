import { Injectable } from '@angular/core';
// import { Http, Headers } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable} from 'rxjs/Observable';
// import { map, catchError } from 'rxjs/operators';

import 'rxjs/Rx';
import { GLOBAL } from './global';
import { User } from '../models/user';
import swal from 'sweetalert';
import { throwError } from 'rxjs/internal/observable/throwError';


@Injectable()
export class UserService {
  public url: String;

  constructor(public _http: HttpClient) {
    this.url = GLOBAL.url;
  }

  prueba() {
    console.log('se ha presionado el botón de registro');
    return 'Hola mundo';
  }

  /**
   * Método de servicio que permite registrar un nuevo usuario en la base de datos del sistema
   * @method register
   * @param  user     Datos del usuario
   * @return          Status de la petición
   */
  register(user: User) {
    console.log('Se registra usuario.');
    const body = JSON.stringify(user);
    const params = 'json=' + body;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this._http.post(this.url + 'register', params, { headers })
      .map((res: any) => {
        console.log('Registro usuario: OK');
        console.log(res);
        return res;
      });
  }

  /**
   * Método de servicio que se utiliza para identificar si un usuario esta registrado en el sistema
   * @method signup
   * @param  user   Email, password y flag para saber si se requiere el token o los datos del usuario
   * @return        Token | Datos del usuario
   */
  signup(user: User) {
    const body = JSON.stringify(user);
    const params = 'json=' + body;
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    return this._http.post(this.url + 'login', params, { headers })
    .map((res: any) => {
      return res;
    });
  }

  getIDentity() {
    const identity = JSON.parse(localStorage.getItem('usuarioRegistrado'));
    if (identity !== 'undefined') {
      return identity;
    } else {
      return null;
    }
  }

  getToken() {
    const token = localStorage.getItem('token');
    if (token !== 'undefined') {
      return token;
    } else {
      return null;
    }
  }
}
