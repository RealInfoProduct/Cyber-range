import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {

	
/*breadcrumbs array */
current_url_array = [];
form_title:string = 'Thank You';

  constructor() { }

  ngOnInit(): void {
  
	/*breadcrumbs array */
		this.current_url_array = [
			{'slug':"",'label':'Thank You'}
		];
  }

}
