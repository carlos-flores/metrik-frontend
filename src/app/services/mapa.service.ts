import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
//import { GLOBAL } from "./global";
import swal from "sweetalert";
import { UserService } from './user.services';
import { Router } from "@angular/router";
import { throwError } from "rxjs/internal/observable/throwError";
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: "root"
})
export class MapaService {
  public urlMapas: String;
  constructor(public http: HttpClient, public usuarioService: UserService, public router: Router) {
    this.urlMapas = environment.url;
//    this.urlMapas = GLOBAL.url;
  }

  obtenerUltimasFacturas() {
    console.log("Se obtienen las últimas facturas");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL = this.urlMapas + "facturas/ultimas/10";
    return this.http.get(URL, { headers }).pipe(
      map((resp: any) => {
        return resp;
      }), catchError(error => {
        this.router.navigate(['/login']);
        swal('Error', 'Detalle: ' + error.error.text, 'error');
        return throwError(error);
      })
    );
  }

  obtenerDetalleFactura($idFactura: number) {
    console.log("Se obtiene detalle de factura");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL = this.urlMapas + "facturas/detalle/" + $idFactura;
    return this.http.get(URL, { headers }).pipe( map((resp: any) => {
        return resp;
      }), catchError(error => {
        this.router.navigate(["/login"]);
        swal("Error", "Detalle: " + error.error.text, "error");
        return throwError(error);
      }) );
  }

  obtenerClientes($fechaIni, $fechaFin) {
    console.log("Se obtienen los clientes");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL =this.urlMapas + "facturas/clientes/periodo/" +  $fechaIni + "/" +  $fechaFin;
    return this.http.get(URL, { headers }).pipe(map((resp: any) => {
        return resp;
    }), catchError(error => {
      this.router.navigate(['/login']);
      swal('Error', 'Detalle: ' + error.error.text, 'error');
      return throwError(error);
    })
    );
  }

  obtenerProductos($fechaIni, $fechaFin) {
    console.log("Se obtienen los productos");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL = this.urlMapas + "facturas/productos/periodo/" + $fechaIni + "/" + $fechaFin;
    return this.http.get(URL, { headers }).pipe(map((resp: any) => {
      return resp;
    }), catchError(error => {
      this.router.navigate(['/login']);
      swal('Error', 'Detalle: ' + error.error.text, 'error');
      return throwError(error);
    })
    );
  }

  obtenerProductosPorPeriodo($fechaIni, $fechaFin,$clientes,$productos,$estados,$montoIni,$montoFin) {
    console.log("Se obtienen los productos");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL = this.urlMapas + "productos/periodo/" + $fechaIni + "/" + $fechaFin +"/clientes/"+$clientes+"/productos/"+$productos+"/estados/"+$estados+"/"+$montoIni+"/"+$montoFin;
    return this.http.get(URL, { headers }).pipe(map((resp: any) => {
      return resp;
    }), catchError(error => {
      this.router.navigate(['/login']);
      swal('Error', 'Detalle: ' + error.error.text, 'error');
      return throwError(error);
    })
    );
  }

  obtenerFacturasPorPeriodo($fechaIni, $fechaFin, $estados) {
    console.log("Se obtienen las facturas por período");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL =
      this.urlMapas + "facturas/porPeriodo/" + $fechaIni + "/" + $fechaFin+"/estados/"+$estados;
    return this.http.get(URL, { headers }).pipe( map((resp: any) => {
        return resp;
      }), catchError(error => {
        this.router.navigate(["/login"]);
        swal("Error", "Detalle: " + error.error.text, "error");
        return throwError(error);
      }) );
  }

  obtenerFacturasPorPeriodoCliente($fechaIni, $fechaFin, $clientes, $estados) {
    console.log("Se obtienen las facturas por período-clientes");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL =
      this.urlMapas + "facturas/porPeriodo/" + $fechaIni + "/" + $fechaFin + "/clientes/" + $clientes + "/estados/" + $estados;
    return this.http.get(URL, { headers }).pipe( map((resp: any) => {
        return resp;
      }), catchError(error => {
        this.router.navigate(["/login"]);
        swal("Error", "Detalle: " + error.error.text, "error");
        return throwError(error);
      }) );
  }

  obtenerFacturasPorPeriodoMonto($fechaIni, $fechaFin, $montoIni, $montoFin, $estados) {
    console.log("Se obtienen las facturas por período-monto");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL =
      this.urlMapas + "facturas/porPeriodo/" + $fechaIni + "/" + $fechaFin + "/monto/" + $montoIni + "/" + $montoFin + "/estados/" + $estados;
    return this.http.get(URL, { headers }).pipe(map((resp: any) => {
      return resp;
    }), catchError(error => {
      this.router.navigate(["/login"]);
      swal("Error", "Detalle: " + error.error.text, "error");
      return throwError(error);
    }));
  }

  obtenerFacturasPorPeriodoProductos($fechaIni, $fechaFin, $productos, $estados) {
    console.log("Se obtienen las facturas por período-productos");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL =
      this.urlMapas + "facturas/porPeriodo/" + $fechaIni + "/" + $fechaFin + "/productos/" + $productos + "/estados/" + $estados;
    return this.http.get(URL, { headers }).pipe(map((resp: any) => {
      return resp;
    }), catchError(error => {
      this.router.navigate(["/login"]);
      swal("Error", "Detalle: " + error.error.text, "error");
      return throwError(error);
    }));
  }

  obtenerFacturasPorPeriodoClienteMonto($fechaIni, $fechaFin, $clientes, $montoIni, $montoFin, $estados) {
    console.log("Se obtienen las facturas por período-clientes-monto");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL =
      this.urlMapas + "facturas/porPeriodo/" + $fechaIni + "/" + $fechaFin + "/clientes/" + $clientes + "/monto/" + $montoIni + "/" + $montoFin + "/estados/" + $estados;
    return this.http.get(URL, { headers }).pipe( map((resp: any) => {
        return resp;
      }), catchError(error => {
        this.router.navigate(["/login"]);
        swal("Error", "Detalle: " + error.error.text, "error");
        return throwError(error);
      }) );
  }

  obtenerFacturasPorPeriodoClienteProductos($fechaIni, $fechaFin, $clientes, $productos, $estados) {
    console.log("Se obtienen las facturas por período-clientes-productos");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL =
      this.urlMapas + "facturas/porPeriodo/" + $fechaIni + "/" + $fechaFin + "/clientes/" + $clientes + "/productos/" + $productos + "/estados/" + $estados;
    return this.http.get(URL, { headers }).pipe(map((resp: any) => {
      return resp;
    }), catchError(error => {
      this.router.navigate(["/login"]);
      swal("Error", "Detalle: " + error.error.text, "error");
      return throwError(error);
    }));
  }

  obtenerFacturasPorPeriodoProductosMonto($fechaIni, $fechaFin, $productos, $montoIni, $montoFin, $estados) {
    console.log("Se obtienen las facturas por período-clientes-monto");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL =
      this.urlMapas + "facturas/porPeriodo/" + $fechaIni + "/" + $fechaFin + "/productos/" + $productos + "/monto/" + $montoIni + "/" + $montoFin + "/estados/" + $estados;
    return this.http.get(URL, { headers }).pipe(map((resp: any) => {
      return resp;
    }), catchError(error => {
      this.router.navigate(["/login"]);
      swal("Error", "Detalle: " + error.error.text, "error");
      return throwError(error);
    }));
  }

  obtenerFacturasPorPeriodoClientesProductosMonto($fechaIni, $fechaFin, $clientes, $productos, $montoIni, $montoFin, $estados) {
    console.log("Se obtienen las facturas por período-clientes-productos-monto");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL =
      this.urlMapas + "facturas/porPeriodo/" + $fechaIni + "/" + $fechaFin + "/clientes/" + $clientes + "/productos/" + $productos + "/monto/" + $montoIni + "/" + $montoFin + "/estados/" + $estados;
    return this.http.get(URL, { headers }).pipe(map((resp: any) => {
      return resp;
    }), catchError(error => {
      this.router.navigate(["/login"]);
      swal("Error", "Detalle: " + error.error.text, "error");
      return throwError(error);
    }));
  }


  obtenerFacturasPorClientePeriodo($cliente, $fechaIni, $fechaFin, $estados) {
    console.log("Se obtienen las facturas por clientes-periodo");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL = this.urlMapas + "facturas/porCliente/" + $cliente + "/periodo/" + $fechaIni + "/" + $fechaFin + "/estados/" + $estados;
    return this.http.get(URL, { headers }).pipe( map((resp: any) => {
        return resp;
      }), catchError(error => {
        this.router.navigate(["/login"]);
        swal("Error", "Detalle: " + error.error.text, "error");
        return throwError(error);
      }) );
  }

  obtenerFacturasPorClientePeriodoMonto($cliente, $fechaIni, $fechaFin, $montoIni, $montoFin, $estados) {
    console.log("Se obtienen las facturas por cliente-período-monto");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL = this.urlMapas + "facturas/porCliente/" + $cliente + "/periodo/" + $fechaIni + "/" + $fechaFin + "/monto/" + $montoIni + "/" + $montoFin + "/estados/" + $estados;
    return this.http.get(URL, { headers }).pipe( map((resp: any) => {
        return resp;
      }), catchError(error => {
        this.router.navigate(["/login"]);
        swal("Error", "Detalle: " + error.error.text, "error");
        return throwError(error);
      }) );
  }

  obtenerFacturasPorClientePeriodoProductos($cliente, $fechaIni, $fechaFin, $productos, $estados) {
    console.log("Se obtienen las facturas por cliente-período-productos");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL = this.urlMapas + "facturas/porCliente/" + $cliente + "/periodo/" + $fechaIni + "/" + $fechaFin + "/productos/" + $productos + "/estados/" + $estados;
    return this.http.get(URL, { headers }).pipe(map((resp: any) => {
      return resp;
    }), catchError(error => {
      this.router.navigate(["/login"]);
      swal("Error", "Detalle: " + error.error.text, "error");
      return throwError(error);
    }));
  }

  obtenerFacturasPorClientePeriodoMontoProductos($cliente, $fechaIni, $fechaFin, $montoIni, $montoFin, $productos, $estados) {
    console.log("Se obtienen las facturas por cliente-período-monto");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL = this.urlMapas + "facturas/porCliente/" + $cliente + "/periodo/" + $fechaIni + "/" + $fechaFin + "/monto/" + $montoIni + "/" + $montoFin + "/productos/" + $productos + "/estados/" + $estados;
    return this.http.get(URL, { headers }).pipe(map((resp: any) => {
      return resp;
    }), catchError(error => {
      this.router.navigate(["/login"]);
      swal("Error", "Detalle: " + error.error.text, "error");
      return throwError(error);
    }));
  }


  obtenerPosicion($ciudad, $estado, $cp, $calle) {
    console.log("Se obtienen la posición geográfica");
    const headers = new HttpHeaders({
      Authorization: this.usuarioService.getToken()
    });
    const URL = "https://maps.googleapis.com/maps/api/geocode/json?sensor=false&address=" + $ciudad + "," + $estado + "," + $cp + "," + $calle +"&key=AIzaSyDNOu2JQ001PxZY-GVwFvVou0_6h_Sj-14";
    return this.http.get(URL).pipe( map((resp: any) => {
        if (resp.status === "OK") {
          return resp.results[0].geometry.location;
        } else {
          return "sin posición";
        }
      }), catchError(error => {
        return "sin posición";
      }) );
  }




}
