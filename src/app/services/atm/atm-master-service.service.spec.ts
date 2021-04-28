import { TestBed } from '@angular/core/testing';

import { AtmMasterServiceService } from './atm-master-service.service';

describe('AtmMasterServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AtmMasterServiceService = TestBed.get(AtmMasterServiceService);
    expect(service).toBeTruthy();
  });
});
