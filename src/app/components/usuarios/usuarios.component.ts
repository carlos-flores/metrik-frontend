import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { UserService } from "../../services/user.services";
import { NgForm } from '@angular/forms';
import { User } from '../../models/user';

declare var $:any;

@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styles: []
})
export class UsuariosComponent implements OnInit {
  public usuarios = [];
  public usuariosTabla = [];
  public identity;
  public token;
  public cargandoUsuarios = false;
  public erroresValidacion = "";
  public registrandoUsuario = false;

  public paginacionActual;
  public paginacionMaxima;

  public usuarioNuevo: any = {
    name: "",
    surname: "",
    email: "",
    role: "",
    password: "",
    password2: ""
  };

  public usuarioSeleccionado: any = {
    name: "",
    surname: "",
    email: "",
    role: "",
    password: "",
    password2: ""
  };

  constructor(private _router: Router, private _srvUser: UserService) {
    this.identity = this._srvUser.getIDentity();
    this.token = this._srvUser.getToken();
  }

  ngOnInit() {
    console.log("Componente usuarios");
    if (!this.identity) {
      this._router.navigate(["/login"]);
    } else if (this.identity.role !== "admin") {
      this._router.navigate(["/home"]);
    } else {
      this.cargarTablaUsuarios();
    }
  }

  cargarTablaUsuarios() {
    this.cargandoUsuarios = true;
    this._srvUser.obtenerUsuarios().subscribe((resp: any) => {
      console.log(resp);
      this.usuarios = resp;
      this.cargandoUsuarios = false;
      this.paginacionActual = 1;
      this.paginacionMaxima = Math.floor(this.usuarios.length / 10) + 1;
      if (this.usuarios.length % 10 === 0 && this.paginacionMaxima > 1) {
        this.paginacionMaxima -= 1;
      }
      console.log("paginación maxima:" + this.paginacionMaxima);
      this.usuariosTabla = this.usuarios.slice(0, 10);
    });
  }

  editarUsuario(usuario) {
    console.log("Se debe de editar el usuario");
    console.log(usuario);
    this.usuarioSeleccionado = usuario;
  }

  eliminarUsuario(usuario) {
    console.log("Se debe de eliminar el usuario");
    console.log(usuario);
    this.usuarioSeleccionado = usuario;
  }

  cambiarPassword(usuario) {
    console.log("Se debe de cambiar el password");
    console.log(usuario);
    this.usuarioSeleccionado = usuario;
  }

  paginaInicial() {
    console.log("Se debe cargar los primeros 10 usuarios");
    this.usuariosTabla = this.usuarios.slice(0, 10);
    console.log(this.usuariosTabla);
    this.paginacionActual = 1;
  }

  paginaFinal() {
    console.log("Se deben cargar los últimos usuarios");
    const posTemp = (this.paginacionMaxima - 1) * 10;
    this.usuariosTabla = this.usuarios.slice(
      posTemp,
      posTemp + this.usuarios.length
    );
    console.log(this.usuariosTabla);
    this.paginacionActual = this.paginacionMaxima;
  }

  paginaAnterior() {
    console.log("Se deben cargar los 10 usuarios anteriores");
    const posTemp = (this.paginacionActual - 2) * 10;
    this.usuariosTabla = this.usuarios.slice(posTemp, posTemp + 10);
    console.log(this.usuariosTabla);
    this.paginacionActual -= 1;
  }

  paginaSiguiente() {
    console.log("Se debe cargar los 10 usuarios siguientes");
    const posTemp = this.paginacionActual * 10;
    this.usuariosTabla = this.usuarios.slice(posTemp, posTemp + 10);
    console.log(this.usuariosTabla);
    this.paginacionActual += 1;
  }

  prepararUsuarioNuevo() {
    this.usuarioNuevo = {
      name: "",
      surname: "",
      email: "",
      role: "",
      password: "",
      password2: ""
    };
  }

  registrarUsuario(formulario: NgForm) {
    console.log("se va a registrar un usuario");
    // Se evalua que el formulario es válido
    if (this.validarFormulario(formulario)) {
      this.registrandoUsuario = true;
      let usuarioNuevo: User = {
        id: 0,
        name: formulario.controls.name.value,
        surname: formulario.controls.surname.value,
        role: formulario.controls.role.value,
        email: formulario.controls.email.value,
        password: formulario.controls.password.value,
        getToken: true
      };
      this._srvUser.register(usuarioNuevo).subscribe((resp: any) => {
        if (resp.code === 400) {
          console.log(resp);
          this.usuarioNuevo.email = null;
          swal("Error al registrar", resp.message, "error");
        } else {
          console.log(resp);
          swal(
            "Usuario registrado",
            "Se ha registrado el usuario en la BD",
            "success"
          );
          this.prepararUsuarioNuevo();

          $("#exampleModal").modal("hide");
          this.cargarTablaUsuarios();
        }
        this.registrandoUsuario = false;
      });
    } else {
      // Formulario Inválido
      swal("Datos incorrectos", this.erroresValidacion, "error");
    }
  }

  actualizarUsuario(formulario: NgForm) {
    console.log("se va a actualizar un usuario");
    // Se evalua que el formulario es válido

    this.registrandoUsuario = true;
    let usuarioNuevo: User = {
      id: this.usuarioSeleccionado.id,
      name: formulario.controls.name.value,
      surname: formulario.controls.surname.value,
      role: formulario.controls.role.value,
      email: formulario.controls.email.value,
      password: "",
      getToken: true
    };
    this._srvUser.update(usuarioNuevo).subscribe((resp: any) => {
      if (resp.code === 400) {
        console.log(resp);
        this.usuarioSeleccionado.email = null;
        swal("Error al actualizar", resp.message, "error");
      } else {
        console.log(resp);
        swal(
          "Usuario Actualizado",
          "Se ha actualizado el usuario en la BD",
          "success"
        );
        this.prepararUsuarioNuevo();

        $("#updateModal").modal("hide");
        this.cargarTablaUsuarios();
      }
      this.registrandoUsuario = false;
    });
  }

  actualizarPasswordUsuario(formulario: NgForm) {
    console.log("se va a actualizar el password de un usuario");
    if (this.validarFormulario(formulario)) {
      this.registrandoUsuario = true;
      let usuarioNuevo: User = {
        id: this.usuarioSeleccionado.id,
        name: "",
        surname: "",
        role: "",
        email: "",
        password: formulario.controls.password.value,
        getToken: true
      };
      this._srvUser.updatePassword(usuarioNuevo).subscribe((resp: any) => {
        if (resp.code === 400) {
          console.log(resp);
          swal("Error al actualizar", resp.message, "error");
        } else {
          console.log(resp);
          swal(
            "Password Actualizado",
            "Se ha actualizado el password del usuario en la BD",
            "success"
          );
          this.prepararUsuarioNuevo();

          $("#updatePasswordModal").modal("hide");
          this.cargarTablaUsuarios();
        }
        this.registrandoUsuario = false;
      });
    } else {
      // Formulario Inválido
      swal("Datos incorrectos", this.erroresValidacion, "error");
    }
  }

  borrarUsuario() {
    console.log("se va a eliminar un usuario");
      this.registrandoUsuario = true;
      this._srvUser.delete(this.usuarioSeleccionado.id).subscribe((resp: any) => {
        console.log(resp);
        swal(
          "Usuario eliminado",
          "Se ha eliminado el usuario de la BD",
          "success"
        );
        this.prepararUsuarioNuevo();

        $("#deleteModal").modal("hide");
        this.cargarTablaUsuarios();
        this.registrandoUsuario = false;
      });
  }

  validarFormulario(formulario: NgForm) {
    console.log("Validando formulario...");
    let valido = true;
    this.erroresValidacion = "";
    if (
      formulario.controls.password.value !== formulario.controls.password2.value
    ) {
      this.erroresValidacion += "El password no es identico.";
      valido = false;
    }
    return valido;
  }
}
