import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators, FormArray, NgForm} from '@angular/forms';
import { Router } from "@angular/router";
import { UserService } from "../../services/user.services";
import swal from "sweetalert";
import { MapaService } from '../../services/mapa.service';
import { Marker } from '../../models/marker';
import { Select2OptionData } from "ng2-select2";


declare var $: any;

@Component({
  selector: "app-mapa",
  templateUrl: "./mapa.component.html",
  styleUrls: ["./mapa.component.css"]
})
export class MapaComponent implements OnInit {
  public identity;
  public token;
  public formularioBusqueda: FormGroup;
  public cargandoClientes = false;
  public cargandoProductos = false;
  public cargandoPuntos = false;

  public lstPuntos: Marker[] = [];

  public erroresValidacion = "";
  public zoom: number = 5;
  public lat: number = 22.207917;
  public lng: number = -101.657618;

  public datosBase: any = {
    fechaIni: "2018-08-01",
    fechaFin: "2018-08-30",
    banderaFactura: true,
    banderaCliente: true,
    banderaProducto: true,
    montoIni: 0,
    montoFin: 1000
  };

  public productosData: Array<Select2OptionData>;
  public optionsProductos: Select2Options;
  public productosValue: string[];
  public productosCadena: string;
  public clientesData: Array<Select2OptionData>;
  public optionsClientes: Select2Options;
  public clientesValue: string[];
  public clientesCadena: string;

  constructor(
    private _router: Router,
    private _srvUser: UserService,
    private _srvMapa: MapaService
  ) {
    this.identity = this._srvUser.getIDentity();
    this.token = this._srvUser.getToken();
  }

  ngOnInit() {
    if (!this.identity) {
      this._router.navigate(["/login"]);
    } else {
      this.obteniendoClientesData(this.datosBase.fechaIni, this.datosBase.fechaFin);
      this.obteniendoProductosData(this.datosBase.fechaIni,this.datosBase.fechaFin);
    }
  }

    productosSeleccionados(data: { value: string[] }) {
        this.productosCadena = data.value.join(",");
    }

    clientesSeleccionados(data: { value: string[] }) {
        this.clientesCadena = data.value.join(",");
    }

  mapaPresionado(evento: any) {
    console.log("Se ha dado click sobre el mapa...");
    console.log(evento);
  }

  marcadorPresionado(marcador: Marker, index: number) {
    console.log("Se ha dado click sobre el marcador...");
    console.log(marcador);
    console.log(index);
  }

  marcadorArrastrado(marcador: Marker, evento: any) {
    console.log("Se ha reubicado el marcador");
    console.log(marcador);
    console.log(evento);
  }

  cerrarWindow() {
    console.log("Se ha cerrado la ventana del marcador");
  }

  buscarClientes(formulario: NgForm) {
    console.log("Se deben de obtener las posiciones");
    console.log(formulario);
    const prueba = true;
    // Se evalua que el formulario es válido
    if (this.validarFormulario(formulario)) {
      // Formulario válido
      this.cargandoPuntos = true;
      // se determina que ws de posiciones se ejecutara
      if (
        formulario.controls.banderaCliente.value &&
        formulario.controls.banderaFactura.value &&
        formulario.controls.banderaProducto.value
      ) {
        console.log("--1--");
        this._srvMapa
          .obtenerFacturasPorPeriodoClientesProductosMonto(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value,
            this.clientesCadena,
            this.productosCadena,
            formulario.controls.montoIni.value,
            formulario.controls.montoFin.value
          )
          .subscribe((resp: any) => {
            if (resp.length > 0) {
              console.log("total de registros:", resp.length);
              console.log(resp);
              this.obtenerPosiciones(resp);
            } else {
                this.lstPuntos=[];
              swal(
                "Sin Datos",
                "No se han encontrado datos para estos criterios de busqueda",
                "warning"
              );
              this.cargandoPuntos = false;
            }
          });
      } else if (
        formulario.controls.banderaCliente.value &&
        formulario.controls.banderaFactura.value
      ) {
        console.log("--2--");
        this._srvMapa
          .obtenerFacturasPorPeriodoClienteMonto(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value,
            this.clientesCadena,
            formulario.controls.montoIni.value,
            formulario.controls.montoFin.value
          )
          .subscribe((resp: any) => {
            if (resp.length > 0) {
              console.log("total de registros:", resp.length);
              console.log(resp);
              this.obtenerPosiciones(resp);
            } else {
                this.lstPuntos = [];
              swal(
                "Sin Datos",
                "No se han encontrado datos para estos criterios de busqueda",
                "warning"
              );
              this.cargandoPuntos = false;
            }
          });
      } else if (
        formulario.controls.banderaCliente.value &&
        formulario.controls.banderaProducto.value
      ) {
        console.log("--3--");
        this._srvMapa
          .obtenerFacturasPorPeriodoClienteProductos(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value,
            this.clientesCadena,
            this.productosCadena
          )
          .subscribe((resp: any) => {
            if (resp.length > 0) {
              console.log("total de registros:", resp.length);
              console.log(resp);
              this.obtenerPosiciones(resp);
            } else {
                this.lstPuntos = [];
              swal(
                "Sin Datos",
                "No se han encontrado datos para estos criterios de busqueda",
                "warning"
              );
              this.cargandoPuntos = false;
            }
          });
      } else if (
        formulario.controls.banderaFactura.value &&
        formulario.controls.banderaProducto.value
      ) {
        console.log("--4--");
        this._srvMapa
          .obtenerFacturasPorPeriodoProductosMonto(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value,
            this.productosCadena,
            formulario.controls.montoIni.value,
            formulario.controls.montoFin.value
          )
          .subscribe((resp: any) => {
            if (resp.length > 0) {
              console.log("total de registros:", resp.length);
              console.log(resp);
              this.obtenerPosiciones(resp);
            } else {
                this.lstPuntos = [];
              swal(
                "Sin Datos",
                "No se han encontrado datos para estos criterios de busqueda",
                "warning"
              );
              this.cargandoPuntos = false;
            }
          });
      } else if (formulario.controls.banderaCliente.value) {
        console.log("--5--");
        this._srvMapa
          .obtenerFacturasPorPeriodoCliente(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value,
            this.clientesCadena
          )
          .subscribe((resp: any) => {
            if (resp.length > 0) {
              console.log("total de registros:", resp.length);
              console.log(resp);
              this.obtenerPosiciones(resp);
            } else {
                this.lstPuntos = [];
              swal(
                "Sin Datos",
                "No se han encontrado datos para estos criterios de busqueda",
                "warning"
              );
              this.cargandoPuntos = false;
            }
          });
      } else if (formulario.controls.banderaFactura.value) {
        console.log("--6--");
        this._srvMapa
          .obtenerFacturasPorPeriodoMonto(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value,
            formulario.controls.montoIni.value,
            formulario.controls.montoFin.value
          )
          .subscribe((resp: any) => {
            if (resp.length > 0) {
              console.log("total de registros:", resp.length);
              console.log(resp);
              this.obtenerPosiciones(resp);
            } else {
                this.lstPuntos = [];
              swal(
                "Sin Datos",
                "No se han encontrado datos para estos criterios de busqueda",
                "warning"
              );
              this.cargandoPuntos = false;
            }
          });
      } else if (formulario.controls.banderaProducto.value) {
        console.log("--7--");
        this._srvMapa
          .obtenerFacturasPorPeriodoProductos(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value,
            this.productosCadena
          )
          .subscribe((resp: any) => {
            if (resp.length > 0) {
              console.log("total de registros:", resp.length);
              console.log(resp);
              this.obtenerPosiciones(resp);
            } else {
                this.lstPuntos = [];
              swal(
                "Sin Datos",
                "No se han encontrado datos para estos criterios de busqueda",
                "warning"
              );
              this.cargandoPuntos = false;
            }
          });
      } else {
        console.log("--8--");
        this._srvMapa
          .obtenerFacturasPorPeriodo(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value
          )
          .subscribe((resp: any) => {
            if (resp.length > 0) {
              console.log("total de registros:", resp.length);
              console.log(resp);
              this.obtenerPosiciones(resp);
            } else {
                this.lstPuntos = [];
              swal(
                "Sin Datos",
                "No se han encontrado datos para estos criterios de busqueda",
                "warning"
              );
              this.cargandoPuntos = false;
            }
          });
      }
    } else {
      // Formulario Inválido
      swal("Datos incorrectos", this.erroresValidacion, "error");
    }
  }

  obteniendoClientesData(fechaInicial, fechaFinal) {
    this.cargandoClientes = true;
    this.clientesValue = [];
    this.optionsClientes = {
          multiple: true,
          placeholder: "Selecciona al menos un cliente"
      };
    this.clientesCadena = "";
    this._srvMapa
      .obtenerClientes(fechaInicial, fechaFinal)
      .subscribe((resp: any) => {
        console.log("total de clientes:", resp.length);
        this.clientesData = [];
        resp.forEach(cliente => {
          this.clientesData.push({
              id: cliente.id,
              text: cliente.customer + " [ " + cliente.id + " ]"
          });
          this.cargandoClientes = false;
        });
      });
  }

  obteniendoProductosData(fechaInicial, fechaFinal) {
    this.cargandoProductos = true;
    this.productosValue = [];
    this.optionsProductos = {
      multiple: true,
      placeholder: "Selecciona al menos un producto"
    };
    this.productosCadena = "";
    this._srvMapa
      .obtenerProductos(fechaInicial, fechaFinal)
      .subscribe((resp: any) => {
        console.log("total de productos:", resp.length);
        this.productosData = [];
        resp.forEach(producto => {
          this.productosData.push({
            id: producto.id,
            text: producto.name + " [ " + producto.code + " ]"
          });
          this.cargandoProductos = false;
        });
      });
  }

  obtenerPosiciones(lstPosicionesCliente) {
    console.log('obteniendo posiciones');
    this.lstPuntos = [];
    lstPosicionesCliente.forEach(cliente => {
      this._srvMapa
        .obtenerPosicion(
          cliente.ciudad_cliente,
          cliente.estado_cliente,
          cliente.codigo_postal,
          cliente.calle
        )
        .subscribe((respPos: any) => {
          if (respPos !== "sin posición") {
            let nuevoMarcador: Marker = {
              id: cliente.id_cliente,
              nombre: cliente.cliente,
              latitud: respPos.lat,
              longitud: respPos.lng,
              descripcion: "Sin descripción",
              ciudad: cliente.ciudad_cliente,
              estado: cliente.estado_cliente,
              totalFacturas: cliente.total_facturas,
              calle: cliente.calle,
              codigo_postal: cliente.codigo_postal,
              arrastrable: false
            };

            this.lstPuntos.push(nuevoMarcador);
          } else {
            console.log(cliente.cliente + " -- SIN POSICION --");
          }
        });
    });
    this.cargandoPuntos = false;
  }

  change(formulario: NgForm) {
    console.log("se ha detectado un cambio de fecha...");
    console.log(formulario);

    if (
      formulario.controls.fechaIni.valid &&
      formulario.controls.fechaFin.valid &&
      this.fechasValidas(
        formulario.controls.fechaIni.value,
        formulario.controls.fechaFin.value
      )
    ) {
      this.obteniendoClientesData(
        formulario.controls.fechaIni.value,
        formulario.controls.fechaFin.value
      );
      this.obteniendoProductosData(
        formulario.controls.fechaIni.value,
        formulario.controls.fechaFin.value
      );
    }
  }

  validarFormulario(formulario: NgForm) {
    console.log("Validando formulario...");
    let valido = true;
    this.erroresValidacion = "";
    if (
      formulario.controls.banderaCliente.value &&
      this.clientesCadena === ""
    ) {
      this.erroresValidacion += "Se debe de seleccionar un cliente. ";
      valido = false;
    } else if (
      formulario.controls.banderaProducto.value &&
      this.productosCadena === ""
    ) {
      this.erroresValidacion += "Se debe de seleccionar un producto. ";
      valido = false;
    }
    return valido;
  }

  fechasValidas(fechaIniControl, fechaFinControl) {
    if (
      Date.parse(fechaIniControl) < Date.parse(fechaFinControl) &&
      Date.parse(fechaFinControl) - Date.parse(fechaIniControl) < 2678400000
    ) {
      return true;
    }
    return false;
  }
}


