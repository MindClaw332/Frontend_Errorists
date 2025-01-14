import { TestBed } from '@angular/core/testing';

import { ResultdataService } from './resultdata.service';

describe('ResultdataService', () => {
  let service: ResultdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
