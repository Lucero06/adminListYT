import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';
import {HttpParams} from "@angular/common/http";

import { Storage } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment'; 


const URL_PREFIX = "https://www.googleapis.com/youtube/v3";
@Injectable({
  providedIn: 'root'
})
export class HttpclientService {

  constructor(private http: HttpClient, private storage: Storage) { 

  }
  params:any='';
  config(token:string){
    console.log('config');
    this.params = new HttpParams().set(
      'key',environment.gak
      )
      .set('access_token',token);
  }


  createPlaylist(playlist){
    console.log('createPlaylist');
    var params:any;
    params=this.params.set('part','snippet, status');
    var httpOptions={
      params:params
    }
    return this.http.post<any>(
      `${URL_PREFIX}/playlists`,
      playlist,
      httpOptions,
    ).toPromise();
  }

  deletePlaylist(id){
    var params:any;
    params=this.params.set('id', id);
    var httpOptions={
      params:params
    }
    return this.http.delete<any>(
      `${URL_PREFIX}/playlists`,
      httpOptions
    ).toPromise();
  }

  getPlaylists(page:string=''){
    // console.log(this.params);
    var params:any;
    params=this.params.set('mine',true)
    .set('part','id, snippet, status')
    .set('maxResults',50);

    if(page!=''){
      // console.log('pageee');
      params=params.set('pageToken', page);
    }
    // console.log(params);
    var httpOptions = {
      // observe: "events",
      params:params,
      // responseType: "json"
    };
    // console.log(httpOptions);
    
    return this.http.get<any>(
        `${URL_PREFIX}/playlists`,
        httpOptions
        );
  
  }

  getPlaylist(id:string){
    var params:any;
    params=this.params.set('mine',true)
    .set('part','id, snippet, status')
    .set('id',id);
    var httpOptions = {
      params:params,
    };
    return this.http.get<any>(
      `${URL_PREFIX}/playlists`,
      httpOptions
      ).toPromise();
  }

  getItemsPlaylists(playListId:string, page_token:string=''){
    var params:any;
    params=this.params.set('mine',true)
    .set('mine',true)
    .set('part','id, snippet, contentDetails,status')
    .set('maxResults',50)
    .set('playlistId',playListId)
    ;
    if(page_token!=''){
      // console.log('pageee');
      params=params.set('pageToken', page_token);
    }
    var httpOptions = {
      // observe: "events",
      params:params,
      // responseType: "json"
    };
    return this.http.get<any>(
      `${URL_PREFIX}/playlistItems`,
      httpOptions
      ).toPromise();
  }

  deleteItemList(item:string){
    var params:any;
    params=this.params.set('mine',true)
    .set('part','id, snippet, contentDetails,status')
    .set('maxResults',50)
    .set('id',item)
    ;
    var httpOptions = {
      params:params,
    };
    console.log('delete');
    return this.http.delete<any>(
      `${URL_PREFIX}/playlistItems`,
      httpOptions
      ).toPromise();      
  }

  copyItemToPlaylist(item:Object){
    console.log(item);
    var params:any;
    params=this.params
    .set('part','snippet, contentDetails,status')
    ;
    var httpOptions = {
      params:params,
    };
    console.log('copy');
    return this.http.post<any>(
      `${URL_PREFIX}/playlistItems`, item,
      httpOptions
      ).toPromise();  
  }

  updatePlaylist(item:Object){
    console.log('updatePlaylist');
    console.log(item);
    var params:any;
    params=this.params
    .set('part','snippet,status');
    var headers= new HttpHeaders().set(
      '',''
    );
    var httpOptions = {
      params:params
      // headers: headers
    };

    console.log(params);
    console.log(item);
    console.log(httpOptions);

    return this.http.put<any>(
      `${URL_PREFIX}/playlists`,item,
      httpOptions
      ).toPromise();
  }


}
