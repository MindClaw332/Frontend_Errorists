import { TestBed } from '@angular/core/testing';

import { GroupdataService } from './groupdata.service';

describe('GroupdataService', () => {
  let service: GroupdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GroupdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
