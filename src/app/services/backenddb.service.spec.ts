import { TestBed } from '@angular/core/testing';

import { BackenddbService } from './backenddb.service';

describe('BackenddbService', () => {
  let service: BackenddbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BackenddbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
