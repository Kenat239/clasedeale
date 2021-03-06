import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Usuario } from '../../interfaces/usuario';
import { Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  public socketStatus = false;
  public token: string = null;

  constructor(
    private socket: Socket,
    private router: Router,
    public _usuarioService: UsuarioService
  ) {
    this.checkStatus();

    if ( this.socketStatus = false ) {
      this.socket.connect();
    }
   }

  checkStatus() {
    this.socket.on('connect', () => {
      console.log('Conectado al servidor de sockets');

      const verificaTok = new Promise((resolve, reject) => {
        this._usuarioService.cargarStorage();
      });

      this.socket.emit('datos-usuario', this._usuarioService.token, (data: any) => {
        verificaTok.then(() => {
          console.log(data);
        });
      });

      this.socketStatus = true;
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor');
      this.socketStatus = false;
    });

    this.socket.on('desconectar', () => {
      console.log('El token tiene problemas, estas siendo desconectado');

      this.router.navigate(['/login']);
      this.socket.disconnect();
    });
  }

  emit( evento: string, payload?: any, callback?: Function ) {
    console.log('Emitiendo mensaje');
    this.socket.emit( evento, payload, callback );
  }

  listen( evento: string ) {
    return this.socket.fromEvent( evento );
  }

  conectar() {
    this.socket.connect();
  }

}
