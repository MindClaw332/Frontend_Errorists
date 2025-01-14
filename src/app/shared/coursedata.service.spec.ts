import { TestBed } from '@angular/core/testing';

import { CoursedataService } from './coursedata.service';

describe('CoursedataService', () => {
  let service: CoursedataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoursedataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
