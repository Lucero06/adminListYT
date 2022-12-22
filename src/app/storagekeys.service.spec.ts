import { TestBed } from '@angular/core/testing';

import { StoragekeysService } from './storagekeys.service';

describe('StoragekeysService', () => {
  let service: StoragekeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoragekeysService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
