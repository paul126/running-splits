import { fakeAsync, tick, flushMicrotasks } from '@angular/core/testing';

import { Runner } from './runner';
import { Split } from './split';
import { Lap } from './lap';

describe('Runner', () => {
  it('creates an instance with the expected properties', () => {
    let testName = 'Test';

    let testRunner = new Runner(testName);
    expect(testRunner.name).toBe(testName);

    expect(testRunner.splitList.length).toBe(0);
    expect(testRunner.splitStartTime).toBe(null);
    expect(testRunner.lapStartTime).toBe(null);
    expect(testRunner.isSelected).toBe(false);
    expect(testRunner.isExpanded).toBe(false);
    expect(testRunner.refreshSplit).toBe(null);
    expect(testRunner.displaySplit).toBe('');
    expect(testRunner.displayLap).toBe('');
    expect(testRunner.lapList.length).toBe(0);
    expect(testRunner.showLastLap).toBe(false);
  });

  it('adds a split', () => {
    let testRunner = new Runner('Test');
    let rawSplitTime = 12345;
    testRunner.lapList = [12345];

    testRunner.addSplit(rawSplitTime);
    expect(testRunner.splitList.length).toBe(1);
    expect(testRunner.splitList[0].rawTime).toBe(12345);
  });

  it('knows if it is running', () => {
    let testRunner = new Runner('Test');

    expect(testRunner.isRunning()).toBe(false);
    testRunner.splitStartTime = new Date();
    expect(testRunner.isRunning()).toBe(true);
    testRunner.splitStartTime = null;
    expect(testRunner.isRunning()).toBe(false);
  });


  it('starts a split', () => {
    let testRunner = new Runner('Test');
    let testDateOne = new Date(1);
    let testDateTwo = new Date(2);
    spyOn(testRunner, 'getCurrentTime').and.returnValue(testDateTwo);
    spyOn(testRunner, 'isRunning').and.returnValue(false);

    testRunner.startSplit(testDateOne);
    expect(testRunner.splitStartTime).toBe(testDateOne);
    expect(testRunner.lapStartTime).toBe(testDateOne);

    testRunner.startSplit();
    expect(testRunner.splitStartTime).toBe(testDateTwo);
    expect(testRunner.lapStartTime).toBe(testDateTwo);
  });

  it('does not attempt to start a split if it is already running', () => {
    let testRunner = new Runner('Test');
    let testDateOne = new Date();
    spyOn(testRunner, 'isRunning').and.returnValue(true);

    testRunner.startSplit(testDateOne);
    expect(testRunner.splitStartTime).not.toBe(testDateOne);
    expect(testRunner.lapStartTime).not.toBe(testDateOne);
  });

  it('stops the current split', () => {
    let testRunner = new Runner('Test');
    let testDateOne = new Date(1);
    testRunner.splitStartTime = new Date(2);
    testRunner.lapStartTime = new Date(3);
    spyOn(testRunner, 'getCurrentTime').and.returnValue(testDateOne);
    spyOn(testDateOne, 'getTime').and.returnValue(20);
    spyOn(testRunner.splitStartTime, 'getTime').and.returnValue(0);
    spyOn(testRunner.lapStartTime, 'getTime').and.returnValue(5);
    spyOn(testRunner, 'isRunning').and.returnValue(true);
    spyOn(testRunner, 'addSplit');
    spyOn(testRunner, 'resetSplit');
    spyOn(testRunner.lapList, 'push');

    testRunner.stopSplit();
    expect(testRunner.lapList.push).toHaveBeenCalledWith(15);
    expect(testRunner.addSplit).toHaveBeenCalledWith(20);
    expect(testRunner.resetSplit).toHaveBeenCalled();
  });

  it('resets the split', () => {
    let testRunner = new Runner('Test');
    testRunner.splitStartTime = new Date(1);
    testRunner.lapStartTime = new Date(2);
    testRunner.lapList = [1, 2, 3];

    testRunner.resetSplit();
    expect(testRunner.splitStartTime).toBe(null);
    expect(testRunner.lapStartTime).toBe(null);
    expect(testRunner.lapList.length).toBe(0);
  });

  it('toggles whether or not it is selected', () => {
    let testRunner = new Runner('Test');

    expect(testRunner.isSelected).toBe(false);
    testRunner.toggleSelected();
    expect(testRunner.isSelected).toBe(true);
    testRunner.toggleSelected();
    expect(testRunner.isSelected).toBe(false);
  });

  it('toggles whether or not it is expanded', () => {
    let testRunner = new Runner('Test');

    expect(testRunner.isExpanded).toBe(false);
    testRunner.toggleExpanded();
    expect(testRunner.isExpanded).toBe(true);
    testRunner.toggleExpanded();
    expect(testRunner.isExpanded).toBe(false);
  });

  it('knows when it has no splits', () => {
    let testRunner = new Runner('Test');

    expect(testRunner.noSplits()).toBe(true);
    testRunner.splitList = [new Split(1, [])];
    expect(testRunner.noSplits()).toBe(false);
  });

  it('starts the timer', fakeAsync(() => {
    let testRunner = new Runner('Test');
    let testDate = new Date();
    spyOn(testRunner, 'startSplit');
    spyOn(testRunner, 'timerInterval');
    spyOn(window, 'setInterval').and.callThrough();

    testRunner.startTimer(testDate);
    tick(101);
    flushMicrotasks();

    expect(testRunner.startSplit).toHaveBeenCalledWith(testDate);
    expect(window.setInterval).toHaveBeenCalled();
    expect(testRunner.timerInterval).toHaveBeenCalled();
    clearInterval(testRunner.refreshSplit);
  }));

  it('sets values during the timer interval correctly when still running', () => {
    let testRunner = new Runner('Test');
    let testDisplayLap = '12:34.5';
    let testDisplaySplit = '54:32.1';
    testRunner.splitStartTime = new Date(0);
    testRunner.lapStartTime = new Date(1);
    testRunner.displayLap = testDisplayLap;
    spyOn(testRunner, 'stopTimer');
    spyOn(testRunner, 'isRunning').and.returnValue(true);
    spyOn(testRunner, 'formatCurrentDisplay').and.returnValue(testDisplaySplit);

    testRunner.showLastLap = true;
    testRunner.timerInterval();
    expect(testRunner.formatCurrentDisplay).toHaveBeenCalledWith(testRunner.splitStartTime);
    expect(testRunner.formatCurrentDisplay).not.toHaveBeenCalledWith(testRunner.lapStartTime);
    expect(testRunner.displayLap).toBe(testDisplayLap);
    expect(testRunner.displaySplit).toBe(testDisplaySplit);

    testRunner.showLastLap = false;
    testRunner.timerInterval();
    expect(testRunner.formatCurrentDisplay).toHaveBeenCalledWith(testRunner.lapStartTime);
    expect(testRunner.displayLap).toBe(testDisplaySplit);
    expect(testRunner.displaySplit).toBe(testDisplaySplit);

    expect(testRunner.stopTimer).not.toHaveBeenCalled();
  });

  it('sets values during the timer interval correctly when done running', () => {
    let testRunner = new Runner('Test');
    let testDisplayLap = '12:34.5';
    let testDisplaySplit = '54:32.1';
    spyOn(testRunner, 'stopTimer');
    spyOn(testRunner, 'isRunning').and.returnValue(false);
    spyOn(testRunner, 'lastSplit').and.returnValue({ formattedTime: testDisplaySplit });
    spyOn(testRunner, 'lastLap').and.returnValue({ formattedTime: testDisplayLap });

    testRunner.timerInterval();
    expect(testRunner.displayLap).toBe(testDisplayLap);
    expect(testRunner.displaySplit).toBe(testDisplaySplit);
    expect(testRunner.stopTimer).toHaveBeenCalled();
  });

  it('stops the interval timer', () => {
    let testRunner = new Runner('Test');
    testRunner.refreshSplit = 'something';
    spyOn(window, 'clearInterval');

    testRunner.stopTimer();
    expect(window.clearInterval).toHaveBeenCalledWith(testRunner.refreshSplit);
  });

  it('returns its last split or an empty one if none', () => {
    let testRunner = new Runner('Test');
    let testSplitOne = new Split(1, [1]);
    let testSplitTwo = new Split(2, [2]);
    let testSplitThree = new Split(3, [3]);

    expect(testRunner.lastSplit().rawTime).toBe(0);
    testRunner.splitList = [testSplitOne];
    expect(testRunner.lastSplit()).toBe(testSplitOne);
    testRunner.splitList = [testSplitOne, testSplitTwo, testSplitThree];
    expect(testRunner.lastSplit()).toBe(testSplitThree);
  });

  it('returns its last lap', () => {
    let testRunner = new Runner('Test');
    let testSplit = new Split(0, []);
    let testLap = new Lap(0, '00:00.0');
    spyOn(testRunner, 'lastSplit').and.returnValue(testSplit);
    spyOn(testSplit, 'lastLap').and.returnValue(testLap);

    let result = testRunner.lastLap();
    expect(result).toBe(testLap);
  });

  it('adds a lap and displays the previous lap time briefly', fakeAsync(() => {
    let testRunner = new Runner('Test');
    testRunner.lapStartTime = new Date(1);
    let testDate = new Date(2);
    spyOn(testRunner, 'isRunning').and.returnValue(true);
    spyOn(testRunner, 'getCurrentTime').and.returnValue(testDate);
    spyOn(testDate, 'getTime').and.returnValue(10);
    spyOn(testRunner.lapStartTime, 'getTime').and.returnValue(0);

    testRunner.addLap();

    tick(1);
    expect(testRunner.showLastLap).toBe(true);
    expect(testRunner.lapList[0]).toBe(10);
    expect(testRunner.lapStartTime).toBe(testDate);

    tick(1500);
    flushMicrotasks();
    expect(testRunner.showLastLap).toBe(false);
  }));

  it('formats the current display', () => {
    let testRunner = new Runner('Test');
    let testDateOne = new Date(1);
    let testDateTwo = new Date(2);
    let testSplit = new Split(0, []);
    spyOn(testRunner, 'getCurrentTime').and.returnValue(testDateTwo);
    spyOn(testDateOne, 'getTime').and.returnValue(0);
    spyOn(testDateTwo, 'getTime').and.returnValue(10);
    spyOn(testRunner, 'getDisplaySplit').and.returnValue(testSplit);

    let result = testRunner.formatCurrentDisplay(testDateOne);
    expect(result).toBe(testSplit.formattedTime);
  });
});
