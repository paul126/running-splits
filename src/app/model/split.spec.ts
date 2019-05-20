import { Split } from './split';

describe('Split', () => {

  it('creates an instance with the expected properties', () => {
    let testRawTimeMs = 500000;
    let testLapList = [200000, 300000];

    let testSplit = new Split(testRawTimeMs, testLapList);
    expect(testSplit.rawTime).toBe(testRawTimeMs);
    expect(testSplit.formattedTime).toBe('8:20.0');
    expect(testSplit.label).toBe('');
    expect(testSplit.lapList.length).toBe(2);
    expect(testSplit.lapList[0].rawTime).toBe(200000);
    expect(testSplit.lapList[0].formattedTime).toBe('3:20.0');
    expect(testSplit.lapList[1].rawTime).toBe(300000);
    expect(testSplit.lapList[1].formattedTime).toBe('5:00.0');
  });

  it('formats a raw time correctly', () => {
    let testSplit = new Split(0, []);
    let testRawTimes = [
      { rawTimeMs: 0, expectedSeconds: 0, expectedFormattedTime: '00:00.0' },
      { rawTimeMs: 9000, expectedSeconds: 9, expectedFormattedTime: '00:09.0' },
      { rawTimeMs: 9949, expectedSeconds: 9.9, expectedFormattedTime: '00:09.9' },
      { rawTimeMs: 9950, expectedSeconds: 10, expectedFormattedTime: '00:10.0' },
      { rawTimeMs: 10000, expectedSeconds: 10, expectedFormattedTime: '00:10.0' },
      { rawTimeMs: 30000, expectedSeconds: 30, expectedFormattedTime: '00:30.0' },
      { rawTimeMs: 30123.45, expectedSeconds: 30.1, expectedFormattedTime: '00:30.1' },
      { rawTimeMs: 59949, expectedSeconds: 59.9, expectedFormattedTime: '00:59.9' },
      { rawTimeMs: 59950, expectedSeconds: 0, expectedFormattedTime: '1:00.0' },
      { rawTimeMs: 60000, expectedSeconds: 0, expectedFormattedTime: '1:00.0' },
      { rawTimeMs: 119949, expectedSeconds: 59.9, expectedFormattedTime: '1:59.9' },
      { rawTimeMs: 119950, expectedSeconds: 0, expectedFormattedTime: '2:00.0' },
      { rawTimeMs: 599940, expectedSeconds: 59.9, expectedFormattedTime: '9:59.9' },
      { rawTimeMs: 599950, expectedSeconds: 0, expectedFormattedTime: '10:00.0' },
      { rawTimeMs: 600000, expectedSeconds: 0, expectedFormattedTime: '10:00.0' }
    ];
    spyOn(testSplit, 'formatSeconds').and.callThrough();

    for (let time of testRawTimes) {
      expect(testSplit.formatTime(time.rawTimeMs)).toBe(time.expectedFormattedTime);
      expect(testSplit.formatSeconds).toHaveBeenCalledWith(time.expectedSeconds);
    }
  });

  it('formats a seconds value correctly', () => {
    let testSplit = new Split(0, []);
    let testRawSeconds = [
      { rawSec: 0, expectedFormattedSec: '00.0' },
      { rawSec: 1, expectedFormattedSec: '01.0' },
      { rawSec: 1.1, expectedFormattedSec: '01.1' },
      { rawSec: 9.9, expectedFormattedSec: '09.9' },
      { rawSec: 10, expectedFormattedSec: '10.0' }
    ];

    for (let sec of testRawSeconds) {
      expect(testSplit.formatSeconds(sec.rawSec)).toBe(sec.expectedFormattedSec);
    }
  });

  it('returns its last lap or an empty one if none', () => {
    let testSplitOne = new Split(0, []);
    let testSplitTwo = new Split(0, [1]);
    let testSplitThree = new Split(0, [1, 2, 3]);

    expect(testSplitOne.lastLap().rawTime).toBe(0);
    expect(testSplitTwo.lastLap().rawTime).toBe(1);
    expect(testSplitThree.lastLap().rawTime).toBe(3);
  });
});
