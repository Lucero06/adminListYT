import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { StoragekeysService } from '../storagekeys.service';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AccesoGuard implements CanActivate {
  constructor(
    private router:Router,
    private storageservice:StoragekeysService,
    private toastController: ToastController,
    ){}
  
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      await this.storageservice.init();
      console.log('listcomponent canActivate');
      await this.storageservice.get('token').then((data)=> {
        console.log('storageservice.get then');
        console.log('token:');
        console.log(data);
        if (data=='' || !data ){
          this.presentToast("Debes iniciar sesión");
          this.router.navigate(['/']);
          return false;
        } 
      });
      return true;
  }

  async presentToast(mensaje:string, color="warning") {
    console.log("presentToast");
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      cssClass: 'custom-toast',
      color: color,
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ],
    });
    await toast.present();
  }


  
}
