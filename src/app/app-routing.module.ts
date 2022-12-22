import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import {ListsComponent} from './lists/lists.component';
import { EditplaylistComponent } from './editplaylist/editplaylist.component';
import { LoginComponent } from './login/login.component';
import { TerminosComponent } from './terminos/terminos.component';
import { AccesoGuard } from './guards/acceso.guard';

const routes: Routes = [
  
  {
    
    path: '',
    // component: AppComponent,
    redirectTo: 'login',
    pathMatch: 'full'
    
    
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'terminos',
    component: TerminosComponent
  },
  {
    path: 'lista',
    component: ListsComponent,
    canActivate: [AccesoGuard]
  },
  {
    path:'editarmodal',
    component:EditplaylistComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes
       , { preloadingStrategy: PreloadAllModules,
        useHash: true,
      }
      )
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
