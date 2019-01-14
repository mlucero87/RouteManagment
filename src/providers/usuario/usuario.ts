import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Platform } from 'ionic-angular';
import { platformBrowser } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { Subscription } from 'rxjs';

@Injectable()
export class UsuarioProvider {

  constructor(private afDB: AngularFirestore, private platform:Platform, private storage:Storage) {
  }
  clave:string;
  user:any = {};
  private doc:Subscription;

  verificarUsuario(clave:string){
    clave = clave.toLocaleLowerCase();
    return new Promise((resolve,reject)=>{
      this.doc = this.afDB.doc(`/usuarios/${clave}`)
        .valueChanges().subscribe(data => {
          if(data){
            this.clave = clave;
            this.user = data;
            this.guardarStorage();
            resolve(true);
          }else
          {
            resolve(false);
          }
        })
    });  
  }

  guardarStorage(){
   if(this.platform.is('cordoba')){
      //Celular
      this.storage.set('clave',this.clave);
   }
   else{
      //navegador
      localStorage.setItem('clave',this.clave);
   }
  }

  obtenerStorage(){
    return new Promise((resolve,reject) =>{
      if(this.platform.is('cordoba')){
        //Celular
        this.storage.get('clave').then((val) => {
         if(val){
           this.clave = val;
           resolve(true);
         }
         else{
           resolve(false);
         }
        });

     }
     else{
        //navegador
        if(localStorage.getItem('clave'))
          {
            this.clave = localStorage.getItem('clave');
            resolve(true)
          }
          else{
            resolve(false);
          }

     }

    })
  }

  borrarUsuario(){
    this.clave = null;
    if(this.platform.is('cordoba')){
      this.storage.remove('clave');
    }else{
      localStorage.removeItem('clave');
    }
    this.doc.unsubscribe();
  }

}
