import { Component, OnInit, NgZone } from '@angular/core';
import { Router} from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { StoragekeysService } from '../storagekeys.service';
import { HttpclientService } from '../httpclient.service';
import { GooglePlus } from '@awesome-cordova-plugins/google-plus/ngx';
import { environment } from 'src/environments/environment'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private storageservice: StoragekeysService,
    private ngZone: NgZone,
    private router: Router,
    private httpclient: HttpclientService,
    private googlePlus: GooglePlus
  ) { }

  msj_terminos:boolean=false;
  terminos:boolean=false;

  public terminos_servicio_youtube='https://www.youtube.com/t/terms';
  public google_privacy_policy='http://www.google.com/policies/privacy';
  public revoke_api_clien_access='https://security.google.com/settings/security/permissions';
  


  public data: any = '';
  private _storage: Storage | null = null;

  async ngOnInit() {
    await this.storageservice.init();
    await this.storageservice.get('token').then((data)=> {
      this.data = data;
      if (this.data!=''){
        // this.gotoList();
      }
    });
  }

  public async logingoogle(){
    this.terminos=true;
    if ( !this.terminos){
      this.msj_terminos=true;
      return false;
    }

    const url = environment.url_auth;
    const client_id=environment.client_id_web;
    const scope =  environment.scopes;
    this.googlePlus.login({
      'scopes':scope,
      'webClientId':client_id
    })
  .then(res => {
    console.log(res);
    var token=res.accessToken;
    this.setkeys('token',token);
  })
  .catch(err => console.error(err));

  }

  public async setkeys(key:string,value:string){
     await this.storageservice.set(key,value).then(async ()=>{
      await this.storageservice.get('token').then((data)=> {
        this.ngZone.run(() => {
          this.data = data;
          this.gotoList();
        });
      })
    });
    console.log(this.data);
  }

  public lenghtkeys(){
    this.storageservice.length();
  }

  gotoList(){
    this.router.navigate(['/lista']);
  }

  terminosA(event){
    console.log(
      event.detail.checked
    );
    if(event.detail.checked){
      this.terminos=true;
      this.msj_terminos=false;
    }else{
      this.terminos=false;
      this.msj_terminos=true;
    }
    
  }

}
