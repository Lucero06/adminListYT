import { Component, OnInit, Input } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Output, EventEmitter } from '@angular/core';
import { Router} from '@angular/router';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-createplaylist',
  templateUrl: './createplaylist.component.html',
  styleUrls: ['./createplaylist.component.scss'],
})
export class CreateplaylistComponent implements OnInit {

  @Input() public httpclient: any;
  @Input() notif : Function;
  @Input() items:any;
  @Input() checkerror: Function;

  // @Output() newItemEvent = new EventEmitter<any>();

  isModalCOpen=false;
  isOpen=false;

  title:string;
  description:string;
  privacyStatus:string;
  tags=[];
  tag_actual:string;

  privacy_status=[
    {clave:'public', texto:'Público'}, 
    {clave:'private',texto:'Privado'}, 
    {clave: 'unlisted',texto:'No listado'}]

  constructor(
    private toastController: ToastController,
    private router: Router,
    public modalCtrl: ModalController,
  ) { }

  ngOnInit() {}

  addTag(evt){
    // evt.preventDefault();
    console.log('addTag');
    this.tags.push(this.tag_actual);
    console.log(this.tags);
    this.tag_actual='';
  }

  deleteTag(index:number){
    this.tags.splice(index,1);
  }

  onWillDismiss(evt) {
    console.log("onWillDismiss");
    console.log(evt);
    this.isModalCOpen = false;
  }

  async createPlaylist(){
    var playlist = {
      'snippet':{
        'title':this.title,
        'description':this.description,
        'privacyStatus':this.privacyStatus
        // ,'tags': this.tags
      }
    }
    console.log(playlist);
    await this.httpclient.createPlaylist(playlist).then(async (data)=>{
      console.log(data);
      // this.addNewItem(data);
      await this.notif("Playlist guardada, actualiza.");
      this.isModalCOpen=false;
      this.title='';
      this.description='';
      this.privacyStatus='';
      this.tags=[];
      this.tag_actual='';
      // this.router.navigate(['/lista']);
      window.location.reload();
    })
    .catch(async (error)=>{
      console.log(error);
      this.modalCtrl.dismiss();
      await this.notif("Ocurrió un error.", 'danger');
      await this.checkerror(error);
      
      
    });

  }

  // addNewItem(value: any) {
  //   console.log('addNewItem');
  //   this.newItemEvent.emit(value);
  // }

  setOpenC(isOpen:boolean){
    console.log('setOpenC');
    this.isModalCOpen=isOpen;
  }

}
