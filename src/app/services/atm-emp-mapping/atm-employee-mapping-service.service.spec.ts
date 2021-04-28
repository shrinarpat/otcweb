import { TestBed } from '@angular/core/testing';

import { AtmEmployeeMappingServiceService } from './atm-employee-mapping-service.service';

describe('AtmEmployeeMappingServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AtmEmployeeMappingServiceService = TestBed.get(AtmEmployeeMappingServiceService);
    expect(service).toBeTruthy();
  });
});
