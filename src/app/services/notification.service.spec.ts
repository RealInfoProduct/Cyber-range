import { TestBed,inject } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    //service = TestBed.inject(NotificationService);
    providers: [NotificationService]
  });

 /* it('should be created', () => {
    expect(service).toBeTruthy();
  });*/

  it('should be created', inject([NotificationService], (service: NotificationService) => {
		expect(service).toBeTruthy();
	}));

});


