import { Component, OnInit, Input } from '@angular/core';
import { InappbrowserService } from '../inappbrowser.service';
@Component({
  selector: 'app-terminos',
  templateUrl: './terminos.component.html',
  styleUrls: ['./terminos.component.scss'],
})
export class TerminosComponent implements OnInit {

  public terminos_servicio_youtube='https://www.youtube.com/t/terms';
  public google_privacy_policy='http://www.google.com/policies/privacy';
  public revoke_api_clien_access='https://security.google.com/settings/security/permissions';
  

  constructor(
    private open:InappbrowserService,
  ) { }

  openurl=this.open;

  ngOnInit() {
    
  }

}
