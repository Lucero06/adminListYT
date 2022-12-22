import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoragekeysService {
  cerrar_sesion=false;

  private _storage: Storage | null = null;

  constructor(private storage: Storage,) { 
    
    
  }
  
  async init() {
    console.log('init');
    const storage = await this.storage.create();
    this._storage = storage;
    console.log('end init');
    this.get('token').then((data)=>{
      if(data.length>0){
        this.cerrar_sesion=true;
      }else{
        this.cerrar_sesion=false;
      }
    });
  }

  public async set(key: string, value: any) {
    console.log('set');
    await this._storage?.set(key, value);
  }

  public async length() {
    console.log('length');
    return this._storage?.length();
  }

  public async get(key:string) {
    console.log('get');
    console.log(key);
    return await this._storage?.get(key);
  }

  public async delete(key:string){
    console.log('delete');
   return await this.storage?.remove(key);
  }

}
