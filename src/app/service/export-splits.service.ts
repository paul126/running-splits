import { Injectable } from '@angular/core';
import { Runner } from '../model/runner';

@Injectable({
  providedIn: 'root'
})
export class ExportSplitsService {

  constructor() { }

  // TODO: export to text file
  exportSplits(runnerList: Runner[]) {
    console.log(runnerList);
  }
}
