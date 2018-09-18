import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.services';
import { MapaService } from "../../services/mapa.service";


@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.css"]
})
export class DefaultComponent implements OnInit {
  public facturas = [];
  public status_car: String = "";
  public identity;
  public token;
  public cargandoUltimasFacturas = false;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _srvUser: UserService,
    private _srvMapa: MapaService
  ) {
    this.identity = this._srvUser.getIDentity();
    this.token = this._srvUser.getToken();
  }

  ngOnInit() {
    console.log("Componente Default - Inicializado correctamente");
    if (!this.identity) {
      this._router.navigate(["/login"]);
    } else {
      this.cargandoUltimasFacturas = true;
      console.log("Se continua correctamente");
      this._srvMapa
        .obtenerUltimasFacturas()
        .subscribe((resp: any) => {
          console.log(resp);
          this.facturas = resp;
          this.cargandoUltimasFacturas = false;
        });
        }
    }
  }

