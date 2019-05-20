import { TestBed } from '@angular/core/testing';

import { ExportSplitsService } from './export-splits.service';

describe('ExportSplitsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExportSplitsService = TestBed.get(ExportSplitsService);
    expect(service).toBeTruthy();
  });
});
