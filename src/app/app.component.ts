import { Component, Injector, NgZone, OnInit, Optional } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { StoragekeysService } from './storagekeys.service';
import { Router, ActivatedRoute, ParamMap, RouterOutlet } from '@angular/router';
import { MenuController } from '@ionic/angular';
import {NavController} from '@ionic/angular';
import { IonRouterOutlet } from '@ionic/angular';
import { InappbrowserService } from './inappbrowser.service';
import { ToastController } from '@ionic/angular';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit{
  public data: any = '';
  private _storage: Storage | null = null;
  public appPages = [
    { title: 'Tus PlayLists', url: '/lista', icon: 'list' },
    { title: 'Iniciar sesión', url: '/login', icon: 'person' },
    // { title: 'Búsqueda', url: '/busqueda', icon:'logo-youtube' },
  ];
  userData: any = {};
  
  public labels = ['label1', 'label2',];

  openurl=this.open;

  cerrar_sesion=false;

  constructor(
    private googlePlus: GooglePlus,
    private open:InappbrowserService,
    public menu : MenuController,
   public router: Router,
   private navCtrl: NavController,
   public storage: StoragekeysService,
   private notif: ToastController,
   @Optional() private routerOutlet:IonRouterOutlet
    ) {}
  async ngOnInit() {
    console.log('cerrar sesion:');
    console.log(this.storage.cerrar_sesion) ;
  }

  closeMenu(){
    this.menu.close();
  }

  async logout(){
    await this.storage.delete('token').then(async (data)=>{
      await this.googlePlus.logout();
      
      this.router.navigate(['/']);
      this.closeMenu();
      this.storage.cerrar_sesion=false;
      const toast = await this.notif.create({
        message: 'Salió de la sesión',
        duration: 1000,
        cssClass: 'custom-toast',
        color: 'warning',
        buttons: [
          {
            text: 'Cerrar',
            role: 'cancel'
          }
        ],
      }
      );
      
      await toast.present();
      // return false;
    });
  }

}
