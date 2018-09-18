import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Car } from '../../models/car';
import { User } from '../../models/user';
import { UserService } from '../../services/user.services';


@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user: User;
  title: String = '';
  status: String = '';
  cadOk: String = 'success';
  cadError: String = 'error';
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _srvUser: UserService
  ) {
    this.title = 'prueba';
    this.user = new User();
    this.user.id = 1;
    this.user.role = 'USER_ROLE';
    this.user.name = '';
  }

  ngOnInit() {
    console.log('Componente register - Inicializado correctamente');
  }

  onSubmit(form) {
    this._srvUser.register(this.user).subscribe(
      response => {
        console.log(response);
        if (response.status == this.cadOk) {
          // Respuesta OK
          this.status = response.status;
          this.user = new User();
          form.reset();
        } else {
          this.status = this.cadError;
        }
      },
      error => {
        this.status = this.cadError;
      }
    );
  }
}
