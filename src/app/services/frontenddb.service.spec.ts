import { TestBed } from '@angular/core/testing';

import { FrontenddbService } from './frontenddb.service';

describe('FrontenddbService', () => {
  let service: FrontenddbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FrontenddbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
