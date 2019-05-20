import { Component, Input } from '@angular/core';
import { Runner } from '../model/runner';
import { Split } from '../model/split';

@Component({
  selector: 'app-split-details',
  templateUrl: './split-details.component.html',
  styleUrls: ['./split-details.component.scss']
})
export class SplitDetailsComponent {

  @Input() runner: Runner;

  constructor() { }

  lapList(split: Split) {
    return split.lapList.map(lap => lap.formattedTime).join(', ');
  }

}
