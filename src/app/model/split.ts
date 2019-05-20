import { Lap } from './lap';

export class Split {

  rawTime: number;
  formattedTime: string;
  label: string;
  lapList: Lap[];

  constructor(rawTime: number, rawLapList: number[]) {
    this.rawTime = rawTime;
    this.formattedTime = this.formatTime(rawTime);
    this.label = '';
    this.lapList = rawLapList.map((rawLap) => {
      return new Lap(rawLap, this.formatTime(rawLap));
    });
  }

  formatTime(time: number) {
    if (time == null) { return ''; }

    // NOTE: rounds to nearest 10th of a second
    let seconds = Math.round(time / 100) / 10;

    if (seconds < 60) { return `00:${this.formatSeconds(seconds)}`; }

    let newSeconds = seconds % 60;
    let minutes =  Math.trunc(seconds / 60);

    return `${minutes.toString()}:${this.formatSeconds(newSeconds)}`;
  }

  // NOTE: only used by formatTime, will never be called with seconds >= 60
  formatSeconds(seconds: number) {
    return `${(seconds < 10 ? '0' : '')}${seconds.toFixed(1)}`;
  }

  lastLap() {
    let lastLap = this.lapList.length > 0 ? this.lapList[this.lapList.length - 1] : new Lap(0, '');

    return lastLap;
  }
}
