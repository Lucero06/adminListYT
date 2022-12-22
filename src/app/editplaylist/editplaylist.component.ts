import { Component, OnInit, Input } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpclientService } from '../httpclient.service';

@Component({
  selector: 'app-editplaylist',
  templateUrl: './editplaylist.component.html',
  styleUrls: ['./editplaylist.component.scss'],
})
export class EditplaylistComponent implements OnInit {
  @Input() public httpclient: any;
  @Input() notif : Function;
  @Input() items:any;
  indexplaylist: any;
  isModalEOpen=false;
  isOpen=false;
  playlistInfo:any={};
  private playlistInfoRest:any={};
  // edit:boolean=false;

  privacy_status=[
    {clave:'public', texto:'Público'}, 
    {clave:'private',texto:'Privado'}, 
    {clave: 'unlisted',texto:'No listado'}]
  

  constructor(
    private toastController: ToastController,
    private httpservice: HttpclientService, 
  ) { }

  ngOnInit() {

  }

  onWillDismiss(evt) {
    console.log("onWillDismiss");
    console.log(evt);
    this.isModalEOpen = false;
  }

  setOpenE(isOpen:boolean, playlist=undefined, index=undefined){
    this.indexplaylist=index;
    if(playlist){
      this.playlistInfo=JSON.parse(JSON.stringify(playlist));
      this.playlistInfoRest=JSON.parse(JSON.stringify( playlist));
    }
    this.isModalEOpen=isOpen;
  }

  async updatePlaylist(){
    console.log(this.playlistInfo);
    var new_object = {
      "id":this.playlistInfo.id,
      "snippet":{
        "title":this.playlistInfo.snippet.title,
        "description":this.playlistInfo.snippet.description
      },
      "status":{
        "privacyStatus":this.playlistInfo.status.privacyStatus
      }
    };
    // console.log(new_object);
    
    await this.httpservice.updatePlaylist(new_object).then((data)=>{
      console.log(data);
      this.notif("Guardado");
      this.items[this.indexplaylist]=data;
      // this.playlist=data;
    })
    .catch((error)=>{
      console.log(error);
      this.notif("Ocurrió un error","danger");
    });
    
  }

  clearChanges(){
    console.log('clearChanges');
    this.playlistInfo=JSON.parse(JSON.stringify(this.playlistInfoRest));
    // console.log(this.playlistInfoRest);
  }

  refreshPlaylist(){

  }

}
