import { Component, Input } from '@angular/core';
import { Runner } from '../model/runner';

@Component({
  selector: 'app-runner',
  templateUrl: './runner.component.html',
  styleUrls: ['./runner.component.scss']
})
export class RunnerComponent {

  @Input() runner: Runner;

  constructor() { }

}
