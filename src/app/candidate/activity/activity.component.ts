import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
  current_url_array = [];
	form_title:string = 'My Activity';
	
	server_url:string;

  constructor() { }

  ngOnInit(): void {
    this.current_url_array = [
			{'slug':"",'label':'My Activity'} 
		];
  }

}
