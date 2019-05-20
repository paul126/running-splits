import { Lap } from './lap';

describe('Lap', () => {

  it('creates an instance with the expected properties', () => {
    let testRawTime = 123000;
    let testFormattedTime = '02:03.0';

    let testLap =  new Lap(testRawTime, testFormattedTime);
    expect(testLap.rawTime).toBe(testRawTime);
    expect(testLap.formattedTime).toBe(testFormattedTime);
  });

});
