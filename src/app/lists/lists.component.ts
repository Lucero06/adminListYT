import { Component, OnInit,NgZone, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { HttpclientService } from '../httpclient.service';
import { StoragekeysService } from '../storagekeys.service';
import { Storage } from '@ionic/storage-angular';
import { Router, ActivatedRoute, ParamMap,CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree  } from '@angular/router';
import { of, throwError, from, Observer, Observable } from 'rxjs';
import { map, catchError, isEmpty } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { EditplaylistComponent } from '../editplaylist/editplaylist.component';
import { CreateplaylistComponent } from '../createplaylist/createplaylist.component';
import { InfiniteScrollCustomEvent } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
})
export class ListsComponent implements OnInit {
  
  load = false;
  @ViewChild(EditplaylistComponent) editplaylist : EditplaylistComponent;
  @ViewChild(CreateplaylistComponent) createplaylist : CreateplaylistComponent;
  temp_all_songs=[]
  temp_all_playlists=[]
  end_delete=true;
  cancel_button=false;
  private token='';
  items: any[] = []; //playlists
  next_button = false;
  prev_button = false;
  private next_page_token='';
  private prev_page_token='';
  total_playlists:number=0;
  public paste_button:boolean=false;
  public active_playlist:string='';
  songs:any;
  total_songs={};
  next_songs_btn=false;
  prev_songs_btn=false;
  private prev_songs_token='';
  private next_songs_token='';
  isModalOpen = false;
  public end_load=false;
  private list_id={}; // lista id de todas canciones por playlist
  private all_data={}; //todo contenido de playlist
  public select_ids_lists: {[k: string]: any} = {}; //lista id canciones seleccionadas por playlist objeto
  count_songs_selected=0; //variable template numero canciones seleccionadas
  private number_songs=0;

  constructor(
    public httpservice: HttpclientService, 
    private storageservice:StoragekeysService,
    private router: Router,
    private ngZone: NgZone,
    private alertController: AlertController,
    private toastController: ToastController,
  ) { }

  async ngOnInit() {
    
    await this.storageservice.init();
    console.log('listcomponent ngOnInit');
    await this.storageservice.get('token').then((data)=> {
      console.log('storageservice.get then');
      console.log('token:');
      console.log(data);
      this.load=true;
      this.httpservice.config(data);
      this.httpservice.getPlaylists()
      .subscribe((data: any) => {
        console.log(data);
        // console.log('get playlists');
        if('pageInfo' in data){
          this.total_playlists=data.pageInfo.totalResults;
        }
        if ('nextPageToken' in data){
          this.next_button=true;
          this.next_page_token=data['nextPageToken'];
        }
        if('prevPageToken' in data){
          this.prev_button=true;
          this.prev_page_token=data['prevPageToken'];
        }
        this.items = data.items
        this.temp_all_playlists=this.items;
        this.load=false;
      }
      ,(error) => {
        this.checkConnectionAndError(error);
        console.log(error.message, error.statusText);
              this.load=false;
            // this.router.navigate(['/']);
            return of([]);
      },
      );
      
    });
  }

  onWillDismiss(evt) {
    console.log("onWillDismiss");
    console.log(evt);
    this.isModalOpen = false;
    // this.active_playlist=undefined;
  }

  checkConnectionAndError(response:HttpErrorResponse){
    console.log('checkConnectionAndError');
    // console.log('statusText:');
    console.log(response.status);
    var status = response.status;
    var error = JSON.parse(JSON.stringify(response.error));
    // console.log(error);
    console.log(error);
    // console.log(error.error.message);
    var message=error.error.message;
     if (!navigator.onLine) {
          return this.presentToast('Revisa tu conexión a internet.', 'danger');
     } else{
      if (status == 401){
        console.log('status 401');
        this.presentToast('Vuelve a iniciar sesión.', 'danger');
        this.router.navigate(['/']);
      }
      else if (status == 404){
        if (message=='Channel not found.'){
          return this.presentToast('Ocurrió un error: '+message
          +' Entra a youtube para crear tu cuenta y canal de youtube con tu cuenta.'
          , 'danger',0);
        }
      }
      else{
        
        this.presentToast('Ocurrió un error: '+message, 'danger');
        this.router.navigate(['/']);
      }
     }
  }

  async presentToast(mensaje:string, color="success", duration=3000) {
    console.log("presentToast");
    const toast = await this.toastController.create({
      message: mensaje,
      duration: duration,
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
  

  async handleRefresh2(event) {
    setTimeout( async()=>{
      this.temp_all_songs=[]
      this.end_delete=true;
      this.cancel_button=false;
      // this.token='';
      this.items = []; //playlists
      this.next_button = false;
      this.prev_button = false;
      this.next_page_token='';
      this.prev_page_token='';
      this.total_playlists=0;
      this.paste_button=false;
      this.active_playlist='';
      this.songs={};
      this.total_songs={};
      this.next_songs_btn=false;
      this.prev_songs_btn=false;
      this.prev_songs_token='';
      this.next_songs_token='';
      this.isModalOpen = false;
      this.end_load=false;
      this.list_id={}; // lista id de todas canciones por playlist 
      this.all_data={};
      this.select_ids_lists = {}; //array canciones seleccionadas por playlist objeto
      this.count_songs_selected=0;
      await this.ngOnInit();
      event.target.complete();
    }, 2000
    );
  }

  pageList(page:string,ev:any=''){ //playlists
    document.getElementById('search-pl').setAttribute('value','');
    this.items=this.temp_all_playlists;
    this.next_button=false;
    this.prev_button=false;
    var page_token='';
    console.log('next token:');
    console.log(this.next_page_token);
    if(page=='next'){
      page_token=this.next_page_token;
    }else{
      page_token=this.prev_page_token;
    }
    if (this.next_page_token!=''){    
      this.httpservice.getPlaylists(page_token)
        .subscribe((data: any) => {   
          if ('nextPageToken' in data){
            this.next_button=true;
            this.next_page_token=data['nextPageToken'];
          }else{
            this.next_page_token='';
          }
          if('prevPageToken' in data){
            this.prev_button=true;
            this.prev_page_token=data['prevPageToken'];
          }
          // console.log(data);
          // this.items = data.items;
          this.items = this.items.concat(data.items);
          this.temp_all_playlists=this.items;
          (ev as InfiniteScrollCustomEvent).target.complete();

        },
        (error)=>{
          this.checkConnectionAndError(error);
        }
        );
      }else{
        (ev as InfiniteScrollCustomEvent).target.complete();
      }
  }

  async deletePlaylist(lista:any, titulo:string){
    console.log('deletePlaylist');
    var alert = await this.alertController.create({
      header: '¿Deseas eliminar la lista de reproducción '+titulo+'?',
      message:'Por favor escribe \'Eliminar\' en el espacio de abajo',
      cssClass: 'custom-alert',
      backdropDismiss:false,
      inputs:[
        {
          name:'eliminar',
          placeholder:'Escribe: Eliminar',
          attributes:{
            maxlength:8
          }
        }
      ],
      buttons: [
        {
          text: 'Confirmar',
          role: 'confirm',
          cssClass: 'alert-button-confirm',
          handler: data => {
            if (data.eliminar == 'Eliminar'){

            }else{
              return false;
            }
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'alert-button-cancel',
          
        },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    if (role=='cancel'){
      return 'ok';
    }

    this.httpservice.deletePlaylist(lista).then(async (data)=>{
      await this.presentToast('Playlist eliminada');
      window.location.reload();
    })
    .catch((error)=>{
      this.checkConnectionAndError(error);
    });
  }

  async selectPlaylist(lista:string, evt){
    console.log('selectPlaylist');
    // console.log(evt.detail.indeterminate); 
  if (!evt.detail.indeterminate){
    console.log(evt.detail.checked);
    var event = Object.assign( evt);
    this.active_playlist=lista;
    if(event.detail.checked === true ){
      if(!this.all_data.hasOwnProperty(this.active_playlist) ){
      this.getPlaylistAllContent()
        .then(async ()=> {
          console.log('then getPlaylistAllContent');
          // this.ngZone.run(async () => {
            await this.selectAllSongsPlaylist(event);
            var count_all_songs=0;
            Object.keys(this.select_ids_lists).forEach(key => {
              count_all_songs+=this.select_ids_lists[key].length;
            });
          this.number_songs=count_all_songs;
          var check_list = document.getElementById("check_"+this.active_playlist);
          check_list?.setAttribute('indeterminate','false');
          check_list?.setAttribute('checked','true');
         }
         );
      }else{
        await this.selectAllSongsPlaylist(event);
      }
    }
    else{
      var check_list = document.getElementById("check_"+this.active_playlist);
      check_list?.setAttribute('indeterminate','false');
      check_list?.setAttribute('checked','false');
      await this.selectAllSongsPlaylist(event);
      var count_all_songs=0;
      Object.keys(this.select_ids_lists).forEach(key => {
        // console.log(key, this.select_ids_lists[key]);
        count_all_songs+=this.select_ids_lists[key].length;

      });
      this.number_songs=count_all_songs;
      }
  }
}

getPlaylistAllContent(next_page_token:string=''): Promise<void> { // all canciones playlists
    console.log('getPlaylistAllContent');
    var playListId=this.active_playlist;
    var page_token=next_page_token;    
      return new Promise<void>( async (resolve, reject) => {
         const theLoop = async (page_token:string) =>  {
          await this.httpservice.getItemsPlaylists(playListId,page_token)
          .then((data)=> {
            console.log('getPlaylistAllContent data playlist:');
            this.total_songs[this.active_playlist]=data.pageInfo.totalResults
            for (let index = 0; index < data.items.length; index++) {
              var element = data.items[index];
              if(!this.all_data.hasOwnProperty(this.active_playlist)){
                this.all_data[this.active_playlist]=[];
                this.all_data[this.active_playlist].push(element); //todos los datos
              }else{
                this.all_data[this.active_playlist].push(element); //todos los datos
              }
              
              if (this.list_id.hasOwnProperty(this.active_playlist)){
                this.list_id[this.active_playlist]?.push(element.id); //id
              }else{
                this.list_id[this.active_playlist]=[];
                this.list_id[this.active_playlist].push(element.id); //id
              }
            }
            if ('nextPageToken' in data){
              page_token=data.nextPageToken;
              theLoop(page_token);
            }else{
              page_token='';
              console.log('end getPlaylistAllContent');
              resolve();
            }
          }).catch((error)=>{
            this.checkConnectionAndError(error);
            reject();
          });
        };
        theLoop(page_token);
      });
  }

  async playListContent(page_direction:string=''){ //canciones playlist
    const run =new Promise<void>(async (resolve,reject)=>{
    console.log('playListContent');
    // console.log(this.all_data[this.active_playlist]);
    this.next_songs_btn=false;
    this.prev_songs_btn=false;
    var playListId=this.active_playlist;
    var page_token=''; //primera pagina
    if(page_direction=='next'){
      page_token=this.next_songs_token;
    }else if (page_direction=='prev'){
      page_token=this.prev_songs_token;
    }else{
      //inicio
      if(!this.all_data.hasOwnProperty(this.active_playlist) ){
        // this.all_data[this.active_playlist]=[];
        await this.getPlaylistAllContent()
          .then((end)=> {
            console.log('getPlaylistAllContent finalizó');
            this.songs=this.all_data[this.active_playlist];
            this.end_load=true;
            resolve();
          })
          .catch((error)=>{
            // this.presentToast('Ocurrió un error','danger');
            this.checkConnectionAndError(error);
          });
      }else{
        this.songs=this.all_data[this.active_playlist];
        this.end_load=true;
        
      } 
    }
    this.temp_all_songs=this.songs;
    console.log('end playListContent');
    });

    return run;

  }
  
  async setOpen(isOpen: boolean, lista:string='') { //abrir modal
    console.log('setOpen');
    
    this.end_load=false;
    // this.total_songs=0;
    // this.count_songs_selected=0;
    this.ngZone.run(() => {
      // this.total_songs=0;
      // this.isModalOpen = false;
      this.isModalOpen = isOpen;
    });
    if(lista!=''){
      this.active_playlist=lista;
      await this.playListContent();
      console.log(this.all_data[this.active_playlist]);
    }
  }

  async refreshPlaylist(event){
    console.log('refreshPlaylist');
    delete this.all_data[this.active_playlist];
    delete this.list_id[this.active_playlist];
    await this.playListContent();
    event.target.complete();
  }

  selectSongPlaylist(unique_id, video_id,evt){
    console.log('selectSongPlaylist');
    var isChecked = evt.detail.checked;
    this.count_songs_selected= 0;
    var active_list=this.active_playlist;
    if(this.select_ids_lists.hasOwnProperty(active_list)){
      var array = this.select_ids_lists[active_list];
      if(isChecked){
        if (!array.includes(unique_id)){
          array.push(unique_id);
          this.select_ids_lists[active_list]=array;
        }
      }else{
        if (array.includes(unique_id)){
          console.log('in array');
          var index=array.indexOf(unique_id);
          if (index !== -1) {
            array.splice(index, 1);
            this.select_ids_lists[active_list]=array;
          }
        }
      }
    }else{
      if(isChecked){
        var array_nuevo = [unique_id];
        this.select_ids_lists[active_list]=array_nuevo;
        console.log('agregar');
      }
    }
    this.count_songs_selected= this.select_ids_lists[active_list].length;
    var count_all_songs=0;
    Object.keys(this.select_ids_lists).forEach(key => {
      // console.log(key, this.select_ids_lists[key]);
      count_all_songs+=this.select_ids_lists[key].length;
    });
    this.number_songs=count_all_songs;
    var check_list = document.getElementById("check_"+this.active_playlist);
    if (this.list_id[this.active_playlist]?.length == this.select_ids_lists[this.active_playlist]?.length
        &&
        this.select_ids_lists[this.active_playlist]?.length!=0
      ){
      check_list?.setAttribute('indeterminate','false');
      check_list?.setAttribute('checked','true');
    }
    else if (this.list_id[this.active_playlist]?.length != this.select_ids_lists[this.active_playlist]?.length
      &&
      this.select_ids_lists[this.active_playlist]?.length!=0){
        check_list?.setAttribute('indeterminate','true');
      }
    else if ( this.select_ids_lists[this.active_playlist]?.length==0){
      check_list?.setAttribute('indeterminate','false');
      check_list?.setAttribute('checked','false');
    }
    console.log('selectSongPlaylist end');
  }

  async selectAllSongsPlaylist(evt){
    console.log('selectAllSongsPlaylist');
    console.log(this.list_id[this.active_playlist]);
    console.log(this.select_ids_lists[this.active_playlist]);

    var isChecked = Boolean(evt.detail.checked);
    console.log(isChecked);
    if(isChecked){
      console.log('checked!');
      const run =new Promise<void>(async (resolve,reject)=>{
        this.select_ids_lists[this.active_playlist]=Object.assign([],this.list_id[this.active_playlist]);
        resolve();
      });
      await run;
      console.log('lengt: !');  
    }else{
      console.log('no selected!');
      this.select_ids_lists[this.active_playlist]=[];
    }
    var check_list = document.getElementById("check_"+this.active_playlist);
    console.log('length,...');
    if (this.list_id[this.active_playlist]?.length == this.select_ids_lists[this.active_playlist]?.length
      &&
      this.select_ids_lists[this.active_playlist]?.length!=0
    ){
    check_list?.setAttribute('indeterminate','false');
    check_list?.setAttribute('checked','true');
    
  }
  else if (this.list_id[this.active_playlist]?.length != this.select_ids_lists[this.active_playlist]?.length
    &&
    this.select_ids_lists[this.active_playlist]?.length!=0){
      check_list?.setAttribute('indeterminate','true');
      
    }
  else if ( this.select_ids_lists[this.active_playlist]?.length==0){
      check_list?.setAttribute('indeterminate','false');
      check_list?.setAttribute('checked','false');
  }      
}

handlerMessage = '';
// roleMessage = '';
async delete(){
  var alert = await this.alertController.create({
    header: '¿Deseas eliminar las canciones seleccionadas?'
    +'('+this.select_ids_lists[this.active_playlist].length+')',
    cssClass: 'custom-alert',
    backdropDismiss:false,
    buttons: [
      {
        text: 'Confirmar',
        role: 'confirm',
        cssClass: 'alert-button-confirm',
      },
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'alert-button-cancel',
      },
    ],
  });
  await alert.present();
  const { role } = await alert.onDidDismiss();
  // this.roleMessage = `Dismissed with role: ${role}`;
  if (role=='cancel'){
    return 'ok';
  }
  
  this.end_delete=false;
      const promise = new Promise<void> (async (resolve,reject) => {
        const theLoop = async (i:number) =>  {
          console.log(this.select_ids_lists[this.active_playlist]);    
          console.log(i);
            var id = this.select_ids_lists[this.active_playlist][i];
            // console.log("delete: "+id);
            await this.httpservice.deleteItemList(id).then((data)=>{
              this.all_data[this.active_playlist].forEach((value, index) => { //borar cancion de lista
                if (value.id == id){
                  this.all_data[this.active_playlist].splice(index, 1);  
                }
              }
                );
            }).catch((error)=>{
              this.checkConnectionAndError(error);
              reject();
            });
            console.log('httpsevice deleteitemlist finaliza');
              if (this.select_ids_lists[this.active_playlist].includes(id)){
                console.log('in array');
                var index=this.select_ids_lists[this.active_playlist].indexOf(id);
                if (index !== -1) {
                  this.select_ids_lists[this.active_playlist].splice(index, 1);
                  console.log('borrado en array');
                }
                console.log(i);
                if (--i >= 0) {
                  theLoop(i);
                }else{
                  // this.playListContent();
                  resolve();
                }
              }
        };


        theLoop(this.select_ids_lists[this.active_playlist].length-1);
      
      });
    await promise.then(()=>{
      this.list_id[this.active_playlist]=[];
      this.all_data[this.active_playlist].forEach((element, index) => { 
        this.list_id[this.active_playlist].push(element.id);
      });
      this.presentToast('Borradas');
    }).catch((error)=>{
      // console.log(error);
      // this.presentToast('Ocurrio un error', 'danger');
      this.checkConnectionAndError(error);
    });
    console.log('end theLoop promise');
    this.end_delete=true;
    
    var check_list = document.getElementById("check_"+this.active_playlist);
    check_list?.setAttribute('checked','false');
    check_list?.setAttribute('indeterminate','false');
    // this.playListContent();
    this.select_ids_lists[this.active_playlist]=[];
    console.log(this.select_ids_lists[this.active_playlist]);
}

  copy(){
    this.isModalOpen = false;
    this.paste_button = true;
    this.cancel_button=true;
  }

  async copySongs(toPlaylistId:string){
    console.log('copySongs');
    console.log('seleccionadas para pegar');
    console.log(this.select_ids_lists);
    console.log(this.select_ids_lists[this.active_playlist].length);
    console.log('desde lista');
    console.log(this.active_playlist);
    console.log(this.select_ids_lists[this.active_playlist]);
    this.load=true;
    const promise = new Promise<void> (async (resolve,reject) => {

    // let theLoop: (i: number) => Promise<void>   = async (i: number) => {
      const theLoop = async (i:number) =>  {
      console.log(i);
      var item = this.select_ids_lists[this.active_playlist][i];
      console.log(item);
      var object = {};
      this.all_data[this.active_playlist].forEach(element => {
        if (element.id == item){
          object = element.snippet.resourceId;
        }
      });
      // element.snippet.resourceId
      console.log(object);
      
      var new_object={
        "snippet":{
          "playlistId":toPlaylistId,
          "resourceId":object
        }
      };
      var result = await this.httpservice.copyItemToPlaylist(new_object).then((data)=>{
        console.log(data);
        if (this.all_data.hasOwnProperty(toPlaylistId)){
          this.all_data[toPlaylistId].push(data);
          this.list_id[toPlaylistId].push(data.id);
        }
      }).catch((error)=>{
        this.checkConnectionAndError(error);
        reject();
      });
      console.log(result);
      console.log(i);
          if (--i >= 0) {
            theLoop(i);
        }else{
          this.playListContent();
          resolve();
        }
    };
    theLoop(this.select_ids_lists[this.active_playlist].length-1);
    });
    // await theLoop(this.select_ids_lists[this.active_playlist].length-1);
    await promise.then(()=>{
      this.presentToast('Copiado. Actualiza playlist para ver nuevos elementos.');
    }).catch((error)=>{
      // this.presentToast('Ocurrió un error', 'danger');
      this.checkConnectionAndError(error);
    });

    console.log('end promise ');
    this.load=false;
    this.paste_button=false;
    this.cancel_button=false;
    this.select_ids_lists[this.active_playlist]=[];
  };

  cancel(){
    this.cancel_button=false;
    this.paste_button=false;
  }


  searchSongs(event){
    const query = event.target.value.toLowerCase();
    // console.log(query);
    // console.log(this.temp_all_songs);
    var new_array:any = [];
    Object.keys(this.temp_all_songs).forEach(key => {
      // console.log(this.temp_all_songs[key].snippet);
      var temp_title = this.temp_all_songs[key].snippet.title;
      var temp_artist = this.temp_all_songs[key].snippet.videoOwnerChannelTitle;
      if(temp_title?.toLowerCase().indexOf(query) > -1 || 
        temp_artist?.toLowerCase().indexOf(query) >-1 ){
        // console.log(temp_title);
        // console.log(temp_artist);
        new_array.push(this.temp_all_songs[key]);
      }else{
      }
    });
    // console.log(new_array);
    this.songs=new_array;
    // this.songs = new_array.filter(d => d.toLowerCase().indexOf(query) > -1);
  }

  searchPlaylists(event){
    const query = event.target.value.toLowerCase();
    var new_array:any = [];
    Object.keys(this.temp_all_playlists).forEach(key => {
      // console.log(
      //   this.temp_all_playlists[key].snippet.title
      // );
        var temp_title = this.temp_all_playlists[key].snippet.title;

      if(temp_title?.toLowerCase().indexOf(query) > -1){
        new_array.push(this.temp_all_playlists[key]);
      }
    });
    this.items=new_array;
  }

}
