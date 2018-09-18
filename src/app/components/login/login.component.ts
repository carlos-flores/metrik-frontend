import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.services';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public title: string;
  public user: User;
  public status: String;
  public cadOk: String = 'success';
  public cadError: String = 'error';

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _srvUser: UserService
  ) {
    this.title = "IDentificate";
    this.user = new User();
    this.user.getToken = true;
  }

  ngOnInit() {
    console.log('Componente cargado adecuadamente');
    this.logout();
  }

  onSubmit(form) {
    this.user.getToken=true;
    console.log('Se intenta hacer login con usuario:' + this.user.email);
    this._srvUser.signup(this.user).subscribe(
      response => {
        console.log(response);
        if(response.status !== this.cadError){
          // Se almacena el token en el localstorage
          localStorage.setItem('token',response);
          this.status = this.cadOk;

          this.user.getToken=false;
          this._srvUser.signup(this.user).subscribe(
            resp => {
              console.log(resp);
              // Se almacena el identity en el localstorage
              localStorage.setItem('usuarioRegistrado',JSON.stringify(resp));
              form.reset();
              this._router.navigate(['home']);
            },
            error => {
              console.log(error);
              this.status = this.cadError;
            }
          );
        }else{
          form.reset();
          this.status = this.cadError;
        }

      },
      error => {
        console.log(error);
        this.status = this.cadError;
      }
    );
  }

  logout(){
    console.log("ejecutando logout -1-...");
    this._route.params.subscribe(
      params=>{
        const logout = +params['sure'];
        if(logout == 1){
          console.log("ejecutando logout -2-...");
          localStorage.removeItem('usuarioRegistrado');
          localStorage.removeItem('token');

          // this.identity = null;
          // this.token = null;
          this._router.navigate(['login']);
        }
      }
    );
  }


}
