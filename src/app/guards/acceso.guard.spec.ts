import { TestBed } from '@angular/core/testing';

import { AccesoGuard } from './acceso.guard';

describe('AccesoGuard', () => {
  let guard: AccesoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AccesoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
