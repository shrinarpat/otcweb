import { TestBed } from '@angular/core/testing';

import { ManageEmployeeServiceService } from './manage-employee-service.service';

describe('ManageEmployeeServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageEmployeeServiceService = TestBed.get(ManageEmployeeServiceService);
    expect(service).toBeTruthy();
  });
});
