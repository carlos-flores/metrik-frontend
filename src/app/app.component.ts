import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from './models/user';
import { UserService } from './services/user.services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
  title = 'app';
  public token;
  public usuarioRegistrado;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _srvUser: UserService
  ) {
    this.token = this._srvUser.getToken();
    this.usuarioRegistrado = this._srvUser.getIDentity();
  }

  ngOnInit() {

  }

  ngDoCheck() {
    this.token = this._srvUser.getToken();
    this.usuarioRegistrado = this._srvUser.getIDentity();
  }
}
