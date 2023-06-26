import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import { DatapassService } from '../../services/datapass.service';
import { Subscription } from 'rxjs/Subscription';
declare const activesidebar:any;
@Component({
  selector: 'app-purchasevoucherlist',
  templateUrl: './purchasevoucherlist.component.html',
  styleUrls: ['./purchasevoucherlist.component.css']
})
export class PurchasevoucherlistComponent implements OnInit {
  resetHeader : Subject<any> = new Subject<any>(); // admin header
  subscription: Subscription;

  current_url_array = [];
  form_title:string = '';

  public _opened: boolean = true; 
	public _toggleSidebar() {
		this._opened = !this._opened;
	}  	
  constructor( private ds: DatapassService) 
  {
    this.form_title = 'Purchase List';
    this.current_url_array = [
    {'slug':"",'label':'Purchase List'},
    ];
   }

  ngOnInit(): void {

    activesidebar(); 

  }
	callResetHeader(event:any)
	{
       this.ds.sendData('wallet');
      //this.resetHeader.next('resetWallet');
	}
}
