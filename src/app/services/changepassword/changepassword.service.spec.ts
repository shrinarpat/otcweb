import { TestBed } from '@angular/core/testing';

import { ChangepasswordService } from './changepassword.service';

describe('ChangepasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChangepasswordService = TestBed.get(ChangepasswordService);
    expect(service).toBeTruthy();
  });
});
