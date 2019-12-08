import { TestBed } from '@angular/core/testing';

import { IonicPullupService } from './ionic-pullup.service';

describe('IonicPullupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: IonicPullupService = TestBed.get(IonicPullupService);
    expect(service).toBeTruthy();
  });
});
