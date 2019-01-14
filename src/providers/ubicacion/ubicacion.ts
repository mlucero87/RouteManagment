import { Injectable } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UsuarioProvider } from '../usuario/usuario';
import { Subscription } from 'rxjs';

@Injectable()
export class UbicacionProvider {
  
  Camion: AngularFirestoreDocument<any>;
  private watch:Subscription;

  constructor(private afDB:AngularFirestore,
              private geolocation: Geolocation,
              public _usuarioProv: UsuarioProvider) {
   

  }

  inizializarCamion(){
    this.Camion = this.afDB.doc(`/usuarios/${this._usuarioProv.clave}`);
  }

  iniciarGeoLocalizacion(){
    this.geolocation.getCurrentPosition().then((resp) => {

      this.Camion.update({
        lat:resp.coords.latitude,
        lng:resp.coords.longitude,
        clave:this._usuarioProv.clave

      });

      this.watch = this.geolocation.watchPosition()
          .subscribe((data) => {
            this.Camion.update({
            lat:data.coords.latitude,
            lng:data.coords.longitude,
            clave:this._usuarioProv.clave
          });
      });

     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }

  detenerUbicacion(){
    try {
      this.watch.unsubscribe();
    } catch (e) {
      console.log(JSON.stringify(e));
    }
  }
}
