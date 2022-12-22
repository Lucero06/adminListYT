import { TestBed } from '@angular/core/testing';

import { InappbrowserService } from './inappbrowser.service';

describe('InappbrowserService', () => {
  let service: InappbrowserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InappbrowserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
