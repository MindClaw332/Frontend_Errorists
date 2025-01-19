import { TestBed } from '@angular/core/testing';

import { UsertestService } from './usertest.service';

describe('UsertestService', () => {
  let service: UsertestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsertestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
