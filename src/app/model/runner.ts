import { Split } from './split';

export class Runner {

  name: string;
  splitList: Split[];
  splitStartTime: Date;
  lapStartTime: Date;
  isSelected: boolean;
  isExpanded: boolean;

  refreshSplit: any;
  displaySplit: string;
  displayLap: string;

  lapList: number[];
  showLastLap: boolean;

  constructor(name: string) {
    this.name = name;
    this.splitList = [];
    this.isSelected = false;
    this.isExpanded = false;
    this.refreshSplit = null;
    this.displaySplit = '';
    this.displayLap = '';
    this.showLastLap = false;
    this.resetSplit();
  }

  addSplit(rawSplit: number) {
    this.splitList.push(new Split(rawSplit, this.lapList));
  }

  isRunning() {
    return this.splitStartTime != null;
  }

  startSplit(splitStartTime: Date = null) {
    if (splitStartTime == null) { splitStartTime = this.getCurrentTime(); }

    if (!this.isRunning()) {
      this.splitStartTime = splitStartTime;
      this.lapStartTime = splitStartTime;
    }
  }

  stopSplit() {
    if (this.isRunning()) {
      let stopTime = this.getCurrentTime();
      let split = stopTime.getTime() - this.splitStartTime.getTime();
      let lap = stopTime.getTime() - this.lapStartTime.getTime();
      this.lapList.push(lap);
      this.addSplit(split);
      this.resetSplit();
    }
  }

  resetSplit() {
    this.splitStartTime = null;
    this.lapStartTime = null;
    this.lapList = [];
  }

  toggleSelected() {
    this.isSelected = !this.isSelected;
  }

  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  noSplits() {
    return this.splitList.length === 0;
  }

  startTimer(splitStartTime: Date = null) {
    this.startSplit(splitStartTime);

    this.refreshSplit = setInterval(() => { this.timerInterval(); }, 100);
  }

  timerInterval() {
    if (this.isRunning()) {
      this.displaySplit = this.formatCurrentDisplay(this.splitStartTime);
      if (!this.showLastLap) { this.displayLap = this.formatCurrentDisplay(this.lapStartTime); }
    } else {
      this.displaySplit = this.lastSplit().formattedTime;
      this.displayLap = this.lastLap().formattedTime;
      this.stopTimer();
    }
  }

  stopTimer() {
    clearInterval(this.refreshSplit);
  }

  lastSplit() {
    let lastSplit = this.splitList.length > 0 ? this.splitList[this.splitList.length - 1] : new Split(0, []);

    return lastSplit;
  }

  lastLap() {
    let lastSplit = this.lastSplit();

    return lastSplit.lastLap();
  }

  addLap() {
    if (this.isRunning()) {
      let lapStopTime = this.getCurrentTime();
      this.showLastLap = true;
      let lap = lapStopTime.getTime() - this.lapStartTime.getTime();
      this.lapList.push(lap);
      this.lapStartTime = lapStopTime;
      setTimeout(() => {
        this.showLastLap = false;
      }, 1500);
    }
  }

  // TODO: probably a cleaner way to do this
  formatCurrentDisplay(startTime: Date) {
    let currentTime = this.getCurrentTime();
    let rawTime = currentTime.getTime() - startTime.getTime();
    let displaySplit = this.getDisplaySplit(rawTime);

    return displaySplit.formattedTime;
  }

  // NOTE: used to make spying in tests easier
  getCurrentTime() {
    return new Date();
  }

  getDisplaySplit(rawTime: number) {
    return new Split(rawTime, []);
  }
}
