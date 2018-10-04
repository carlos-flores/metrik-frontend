import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators, FormArray, NgForm} from '@angular/forms';
import { Router } from "@angular/router";
import { UserService } from "../../services/user.services";
import swal from "sweetalert";
import { MapaService } from '../../services/mapa.service';
import { Marker } from '../../models/marker';
import { Select2OptionData } from "ng2-select2";
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

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
  public lstProductos = [];
  public lstClientes = [];

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
    banderaEstado: true,
    montoIni: 0,
    montoFin: 1000
  };

  public productosData: Array<Select2OptionData>;
  public optionsProductos: Select2Options;
  public productosValue: string[];
  public productosCadena: string;

  public estadosData: Array<Select2OptionData>;
  public optionsEstados: Select2Options;
  public estadosValue: string[];
  public estadosCadena: string;

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
      this.obteniendoClientesData(
        this.datosBase.fechaIni,
        this.datosBase.fechaFin
      );
      this.obteniendoProductosData(
        this.datosBase.fechaIni,
        this.datosBase.fechaFin
      );
      this.obteniendoEstadosData();
    }
  }

  /**********************************************
   *              E V E N T O S
   **********************************************/

  /*
  Evento ligado al detectarse un cambio en una fecha.
  Evalua si las fechas son validad.
  Si son validas -> Obtiene los productos y los clientes
  */
  change(formulario: NgForm) {
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

  /*
  Evento ligado al detectarse un cambio en los productos seleccionados.
  Crea una cadena se productos separados por una coma
  */
  productosSeleccionados(data: { value: string[] }) {
    this.productosCadena = data.value.join(",");
  }

  /*
  Evento ligado al detectarse un cambio en los clientes seleccionados.
  Crea una cadena de clientes separados por una coma
  */
  clientesSeleccionados(data: { value: string[] }) {
    this.clientesCadena = data.value.join(",");
  }

  /*
  Evento ligado al detectarse un cambio en los estados seleccionados.
  Crea una cadena se estados separados por una coma
  */
  estadosSeleccionados(data: { value: string[] }) {
    this.estadosCadena = data.value.join(",");
  }

  /*
  Evento ligado al detectarse un click sobre el mapa.
  */
  mapaPresionado(evento: any) {
    console.log("Se ha dado click sobre el mapa...");
    console.log(evento);
  }

  /*
  Evento ligado al detectarse un click sobre un marcador.
  */

  marcadorPresionado(marcador: Marker, index: number) {
    console.log("Se ha dado click sobre el marcador...");
    console.log(marcador);
    console.log(index);
  }

  /*
  Evento ligado al detectarse un drag and drop sobre un marcador.
  */
  marcadorArrastrado(marcador: Marker, evento: any) {
    console.log("Se ha reubicado el marcador");
    console.log(marcador);
    console.log(evento);
  }

  /*
  Evento ligago al cerrado de la ventana de un marcador
   */
  cerrarWindow() {
    console.log("Se ha cerrado la ventana del marcador");
  }

  /*
  Evento ligado al botón para buscar clientes en base a los valores de los filtros.
  Acciones:
  1. Evalua el formulario
  2. Determina que WS se debe invocar para obtener los resultados
  */
  buscarClientes(formulario: NgForm) {
    console.log("Se deben de obtener las posiciones");
    console.log(formulario);
    console.log("clientes");
    console.log(this.clientesValue);
    console.log(this.clientesCadena);
    console.log("estados");
    console.log(this.estadosValue);
    console.log("->" + this.estadosCadena);
    const prueba = true;
    let mntINI = -1;
    let mntFIN = -1;
    // Se evalua que el formulario es válido
    if (this.validarFormulario(formulario)) {
      // Formulario válido

      if (!formulario.controls.banderaCliente.value) {
        this.clientesCadena = "TODOS";
      }

      if (formulario.controls.banderaFactura.value) {
        mntINI = formulario.controls.montoIni.value;
        mntFIN = formulario.controls.montoFin.value;
      }

      if (!formulario.controls.banderaProducto.value) {
        this.productosCadena = "TODOS";
      }

      if (!formulario.controls.banderaEstado.value) {
        this.estadosCadena = "TODOS";
      }

      this._srvMapa
        .obtenerProductosPorPeriodo(
          formulario.controls.fechaIni.value,
          formulario.controls.fechaFin.value,
          this.clientesCadena,
          this.productosCadena,
          this.estadosCadena,
          mntINI,
          mntFIN
        )
        .subscribe((resp: any) => {
          if (resp.length > 0) {
            this.lstProductos = resp;
            console.log("total de productos:", resp.length);
            console.log(resp);
          }
        });

      this.cargandoPuntos = true;
      // se determina que ws de posiciones se ejecutara
      if (
        formulario.controls.banderaCliente.value &&
        formulario.controls.banderaFactura.value &&
        formulario.controls.banderaProducto.value
      ) {
        this._srvMapa
          .obtenerFacturasPorPeriodoClientesProductosMonto(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value,
            this.clientesCadena,
            this.productosCadena,
            formulario.controls.montoIni.value,
            formulario.controls.montoFin.value,
            this.estadosCadena
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
        formulario.controls.banderaFactura.value
      ) {
        this._srvMapa
          .obtenerFacturasPorPeriodoClienteMonto(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value,
            this.clientesCadena,
            formulario.controls.montoIni.value,
            formulario.controls.montoFin.value,
            this.estadosCadena
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
        this._srvMapa
          .obtenerFacturasPorPeriodoClienteProductos(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value,
            this.clientesCadena,
            this.productosCadena,
            this.estadosCadena
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
        this._srvMapa
          .obtenerFacturasPorPeriodoProductosMonto(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value,
            this.productosCadena,
            formulario.controls.montoIni.value,
            formulario.controls.montoFin.value,
            this.estadosCadena
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
        this._srvMapa
          .obtenerFacturasPorPeriodoCliente(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value,
            this.clientesCadena,
            this.estadosCadena
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
        this._srvMapa
          .obtenerFacturasPorPeriodoMonto(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value,
            formulario.controls.montoIni.value,
            formulario.controls.montoFin.value,
            this.estadosCadena
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
        this._srvMapa
          .obtenerFacturasPorPeriodoProductos(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value,
            this.productosCadena,
            this.estadosCadena
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
        this._srvMapa
          .obtenerFacturasPorPeriodo(
            formulario.controls.fechaIni.value,
            formulario.controls.fechaFin.value,
            this.estadosCadena
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

  public productosPDF() {
    const data = document.getElementById("tablaProductos");
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL("image/png");
      let pdf = new jspdf("p", "mm", "a4"); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
      pdf.save("productos.pdf"); // Generated PDF
    });
  }

  public clientesPDF() {
    const data = document.getElementById("tablaClientes");
    html2canvas(data).then(canvas => {
      // Few necessary setting options
      const imgWidth = 208;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL("image/png");
      let pdf = new jspdf("p", "mm", "a4"); // A4 size page of PDF
      const position = 0;
      pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
      pdf.save("clientes.pdf"); // Generated PDF
    });
  }

  /**************************************************
   *     M e t o d o s    d e    U t i l i d a d
   **************************************************/

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

  obteniendoEstadosData() {
    this.estadosValue = [];
    this.optionsEstados = {
      multiple: true,
      placeholder: "Selecciona al menos un estado"
    };
    this.estadosCadena = "";
    this.estadosData = [];
    this.estadosData.push({ id: "127", text: "Aguascalientes" });
    this.estadosData.push({ id: "295", text: "Baja California" });
    this.estadosData.push({ id: "128", text: "Baja California Norte" });
    this.estadosData.push({ id: "129", text: "Baja California Sur" });
    this.estadosData.push({ id: "131", text: "Campeche" });
    this.estadosData.push({ id: "135", text: "Chiapas" });
    this.estadosData.push({ id: "132", text: "Chihuahua" });
    this.estadosData.push({ id: "137", text: "Ciudad de México" });
    this.estadosData.push({ id: "133", text: "Coahuila" });
    this.estadosData.push({ id: "134", text: "Colima" });
    this.estadosData.push({ id: "138", text: "Durango" });
    this.estadosData.push({ id: "147", text: "Estado de México " });
    this.estadosData.push({ id: "140", text: "Guanajuato" });
    this.estadosData.push({ id: "139", text: "Guerrero" });
    this.estadosData.push({ id: "143", text: "Hidalgo" });
    this.estadosData.push({ id: "65", text: "Jalisco" });
    this.estadosData.push({ id: "148", text: "Michoacán" });
    this.estadosData.push({ id: "149", text: "Morelos" });
    this.estadosData.push({ id: "151", text: "Nayarit" });
    this.estadosData.push({ id: "150", text: "Nuevo León" });
    this.estadosData.push({ id: "152", text: "Oaxaca" });
    this.estadosData.push({ id: "153", text: "Puebla" });
    this.estadosData.push({ id: "155", text: "Querétaro" });
    this.estadosData.push({ id: "154", text: "Quintana Roo" });
    this.estadosData.push({ id: "158", text: "San Luis Potosí" });
    this.estadosData.push({ id: "157", text: "Sinaloa" });
    this.estadosData.push({ id: "160", text: "Sonora" });
    this.estadosData.push({ id: "162", text: "Tabasco" });
    this.estadosData.push({ id: "194", text: "Tamaulipas" });
    this.estadosData.push({ id: "195", text: "Tlaxcala" });
    this.estadosData.push({ id: "165", text: "Veracruz" });
    this.estadosData.push({ id: "166", text: "Yucatán" });
    this.estadosData.push({ id: "198", text: "Zacatecas" });
  }

  obtenerPosiciones(lstPosicionesCliente) {
    console.log("obteniendo posiciones");
    this.lstPuntos = [];
    this.lstClientes = [];
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
              arrastrable: false,
              localizado: true
            };

            this.lstPuntos.push(nuevoMarcador);
            this.lstClientes.push(nuevoMarcador);
          } else {
            console.log(cliente.cliente + " -- SIN POSICION --");
            let nuevoMarcador: Marker = {
              id: cliente.id_cliente,
              nombre: cliente.cliente,
              descripcion: "Sin descripción",
              ciudad: cliente.ciudad_cliente,
              estado: cliente.estado_cliente,
              totalFacturas: cliente.total_facturas,
              calle: cliente.calle,
              codigo_postal: cliente.codigo_postal,
              localizado: false
            };
            this.lstClientes.push(nuevoMarcador);
          }
        });
    });
    this.cargandoPuntos = false;
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
    } else if (
      formulario.controls.banderaEstado.value &&
      this.estadosCadena === ""
    ) {
      this.erroresValidacion += "Se debe de seleccionar un estado. ";
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


