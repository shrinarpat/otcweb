import { TestBed } from '@angular/core/testing';

import { ManageTenantServiceService } from './manage-tenant-service.service';

describe('ManageTenantServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ManageTenantServiceService = TestBed.get(ManageTenantServiceService);
    expect(service).toBeTruthy();
  });
});
