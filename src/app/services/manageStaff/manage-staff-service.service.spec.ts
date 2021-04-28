import { TestBed } from '@angular/core/testing';

import { ManageStaffServiceService } from './manage-staff-service.service';

describe('ManageStaffServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageStaffServiceService = TestBed.get(ManageStaffServiceService);
    expect(service).toBeTruthy();
  });
});
