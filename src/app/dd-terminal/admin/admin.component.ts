import { Component, OnInit } from '@angular/core';

import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

	public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}  
  subscription: Subscription;
  showheader:boolean = true;

  constructor( private ds: DatapassService
  ) { }

  ngOnInit(){

    this.subscription = this.ds.getData().subscribe(x => {
			if(x=='admin_sidebar_hide')
			{
         this._opened = false;
         this.showheader = false;
			}else if(x=='admin_sidebar_show')
			{
         this._opened = true;
         this.showheader = true;
			}
		  });
 
  }

  onActivate(obj:any)
  {
      if(typeof(obj.preloadData)==='function')
      {
        obj.preloadData();
      }  
  }

  
}
