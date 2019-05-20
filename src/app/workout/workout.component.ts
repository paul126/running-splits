import { Component, OnInit } from '@angular/core';
import { Runner } from '../model/runner';

@Component({
  selector: 'app-workout',
  templateUrl: './workout.component.html',
  styleUrls: ['./workout.component.scss']
})
export class WorkoutComponent implements OnInit {

  runnerList: Runner[];

  constructor() { }

  ngOnInit() {
    this.runnerList = [];
    this.addRunner();
  }

  addRunner() {
    this.runnerList.push(new Runner(''));
  }

  removeSelectedRunners() {
    if (!this.noRunnersSelected()) {
      let selectedRunnersNames = this.selectedRunners().map(r => r.name).join(', ');

      let remove = confirm(`Are you sure you want to remove ${selectedRunnersNames} from the workout?`);

      if (remove) {
        this.runnerList = this.runnerList.filter(r => !r.isSelected);
      }
    }
  }

  groupStart() {
    let start = this.getStartTime();
    let startList = [];

    if (this.noRunnersSelected()) {
      startList = this.runnerList.filter(r => !r.isRunning());

      if (startList.length === 0) {
        alert('All runners currently running.');
      }
    } else {
      startList = this.selectedRunners().filter(r => !r.isRunning());

      if (startList.length === 0) {
        alert('All selected runners currently running.');
      }
    }

    for (let runner of startList) {
        runner.startTimer(start);
    }
  }

  noRunnersSelected() {
    return this.selectedRunners().length === 0;
  }

  selectedRunners() {
    return this.runnerList.filter(r => r.isSelected);
  }

  // NOTE: used to make spying in tests easier
  getStartTime() {
    return new Date();
  }
}
