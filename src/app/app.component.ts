import { Component, OnInit } from '@angular/core';
import { Location } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],  
})
export class AppComponent implements OnInit {
  title = 'CyberRange';

  constructor( 
    ) { }
  
    ngOnInit(){
    }

  onActivate(obj:any)
  {
      if(typeof(obj.preloadData)==='function')
      {
        obj.preloadData();
      }  
  }
}
