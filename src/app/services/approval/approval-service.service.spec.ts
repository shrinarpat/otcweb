import { TestBed } from '@angular/core/testing';

import { ApprovalServiceService } from './approval-service.service';

describe('ApprovalServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApprovalServiceService = TestBed.get(ApprovalServiceService);
    expect(service).toBeTruthy();
  });
});
