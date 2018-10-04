export class Marker {

    constructor (
      public id?: string,
      public nombre?: string,
      public latitud?: number,
      public longitud?: number,
      public ciudad?: string,
      public estado?: string,
      public calle?: string,
      public codigo_postal?: string,
      public descripcion?: string,
      public totalFacturas?: number,
      public arrastrable?: boolean,
      public localizado?: boolean
    ) { }

}
