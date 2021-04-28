import { TestBed } from '@angular/core/testing';

import { DailyActivityServiceService } from './daily-activity-service.service';

describe('DailyActivityServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DailyActivityServiceService = TestBed.get(DailyActivityServiceService);
    expect(service).toBeTruthy();
  });
});
