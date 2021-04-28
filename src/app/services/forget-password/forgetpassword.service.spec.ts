import { TestBed } from '@angular/core/testing';

import { ForgetpasswordService } from './forgetpassword.service';

describe('ForgetpasswordService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ForgetpasswordService = TestBed.get(ForgetpasswordService);
    expect(service).toBeTruthy();
  });
});
