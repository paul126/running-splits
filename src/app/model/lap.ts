export class Lap {

  rawTime: number;
  formattedTime: string;

  constructor(rawTime: number, formattedTime: string) {
    this.rawTime = rawTime;
    this.formattedTime = formattedTime;
  }
}
