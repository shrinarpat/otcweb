import { TestBed } from '@angular/core/testing';

import { BranchServiceService } from './branch-service.service';

describe('BranchServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BranchServiceService = TestBed.get(BranchServiceService);
    expect(service).toBeTruthy();
  });
});
