import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';

import { StoragekeysService } from './storagekeys.service';

import { ListsComponent } from './lists/lists.component';
import { EditplaylistComponent } from './editplaylist/editplaylist.component';
import { LoginComponent } from './login/login.component';
import { TerminosComponent } from './terminos/terminos.component';
import { CreateplaylistComponent } from './createplaylist/createplaylist.component';

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
// import { GooglePlus} from '@ionic-native/google-plus';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';

@NgModule({
  declarations: [AppComponent,
    ListsComponent,
    EditplaylistComponent,
    LoginComponent,
    TerminosComponent,
    CreateplaylistComponent
  ],
  imports: [
    BrowserModule, 
    IonicModule.forRoot({}) 
    ,AppRoutingModule
    // ,AppRoutingModule.forRoot()
    ,CommonModule
    ,IonicModule
    ,FormsModule
    ,RouterModule.forRoot([])
    ,HttpClientModule
    
    ,IonicStorageModule.forRoot()
    
    
  ],
  providers: [
    // GooglePlus,
    
    { provide: RouteReuseStrategy, 
      useClass: IonicRouteStrategy ,
      
    },
    StoragekeysService
    ,InAppBrowser
    ,GooglePlus
  ],
  bootstrap: [AppComponent],
  schemas:[
    NO_ERRORS_SCHEMA
  ]
})
export class AppModule {}
