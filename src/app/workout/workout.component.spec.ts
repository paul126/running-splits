import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { Runner } from '../model/runner';

import { WorkoutComponent } from './workout.component';
import { RunnerComponent } from '../runner/runner.component';
import { SplitDetailsComponent } from '../split-details/split-details.component';

describe('WorkoutComponent', () => {
  let component: WorkoutComponent;
  let fixture: ComponentFixture<WorkoutComponent>;
  let testRunnerOne: Runner;
  let testRunnerTwo: Runner;
  let testRunnerThree: Runner;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkoutComponent, RunnerComponent, SplitDetailsComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    testRunnerOne = new Runner('One');
    testRunnerTwo = new Runner('Two');
    testRunnerThree = new Runner('Three');
    fixture = TestBed.createComponent(WorkoutComponent);
    component = fixture.componentInstance;
    component.runnerList = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('adds a new runner to the list on init', () => {
    spyOn(component, 'addRunner');

    component.ngOnInit();
    expect(component.addRunner).toHaveBeenCalled();
  });

  it('adds a runner to the list', () => {
    component.runnerList = [];
    component.addRunner();
    expect(component.runnerList.length).toBe(1);
    expect(component.runnerList[0].name).toBe('');

    component.addRunner();
    expect(component.runnerList.length).toBe(2);
    expect(component.runnerList[1].name).toBe('');
  });

  it('removes a selected runner from the list if confirmed', () => {
    component.runnerList = [testRunnerOne, testRunnerTwo, testRunnerThree];
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component, 'selectedRunners').and.callThrough();
    spyOn(component, 'noRunnersSelected').and.callThrough();

    testRunnerOne.isSelected = true;
    component.removeSelectedRunners();
    expect(component.runnerList.length).toBe(2);
    expect(component.selectedRunners().indexOf(testRunnerOne) > -1).toBe(false);
    expect(window.confirm).toHaveBeenCalledWith(`Are you sure you want to remove ${testRunnerOne.name} from the workout?`);
    component.removeSelectedRunners();
    expect(component.runnerList.length).toBe(2);
    expect(component.selectedRunners().indexOf(testRunnerOne) > -1).toBe(false);

    testRunnerTwo.isSelected = true;
    testRunnerThree.isSelected = true;
    component.removeSelectedRunners();
    expect(component.runnerList.length).toBe(0);
    expect(component.selectedRunners().indexOf(testRunnerTwo) > -1).toBe(false);
    expect(component.selectedRunners().indexOf(testRunnerThree) > -1).toBe(false);
    expect(window.confirm).toHaveBeenCalledWith(`Are you sure you want to remove ${testRunnerTwo.name + ', ' + testRunnerThree.name} from the workout?`);
  });

  it('does not remove a runner from the list if not confirmed', () => {
    component.runnerList = [testRunnerOne, testRunnerTwo, testRunnerThree];
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(component, 'selectedRunners').and.callThrough();
    spyOn(component, 'noRunnersSelected').and.callThrough();
    testRunnerOne.isSelected = true;

    component.removeSelectedRunners();
    expect(window.confirm).toHaveBeenCalledWith(`Are you sure you want to remove ${testRunnerOne.name} from the workout?`)
    expect(component.runnerList.length).toBe(3);
    expect(component.selectedRunners().indexOf(testRunnerOne) > -1).toBe(true);
  });

  it('starts all runners not currently running if no runners selected', () => {
    let testDate = new Date();
    component.runnerList = [testRunnerOne, testRunnerTwo, testRunnerThree];
    spyOn(testRunnerOne, 'startTimer');
    spyOn(testRunnerTwo, 'startTimer');
    spyOn(testRunnerThree, 'startTimer');
    spyOn(testRunnerThree, 'isRunning').and.returnValue(true);
    testRunnerOne.isSelected = false;
    testRunnerTwo.isSelected = false;
    testRunnerThree.isSelected = false;
    spyOn(component, 'getStartTime').and.returnValue(testDate);
    spyOn(component, 'selectedRunners').and.callThrough();
    spyOn(component, 'noRunnersSelected').and.callThrough();

    component.groupStart();
    expect(component.selectedRunners).toHaveBeenCalled();
    expect(component.noRunnersSelected).toHaveBeenCalled();
    expect(testRunnerOne.startTimer).toHaveBeenCalledWith(testDate);
    expect(testRunnerTwo.startTimer).toHaveBeenCalledWith(testDate);
    expect(testRunnerThree.startTimer).not.toHaveBeenCalled();
  });

  it('starts the group of selected runners not currently running', () => {
    let testDate = new Date();
    component.runnerList = [testRunnerOne, testRunnerTwo, testRunnerThree];
    spyOn(testRunnerOne, 'startTimer');
    spyOn(testRunnerTwo, 'startTimer');
    spyOn(testRunnerTwo, 'isRunning').and.returnValue(true);
    spyOn(testRunnerThree, 'startTimer');
    testRunnerOne.isSelected = true;
    testRunnerTwo.isSelected = true;
    testRunnerThree.isSelected = false;
    spyOn(component, 'getStartTime').and.returnValue(testDate);
    spyOn(component, 'selectedRunners').and.callThrough();
    spyOn(component, 'noRunnersSelected').and.callThrough();

    component.groupStart();
    expect(component.selectedRunners).toHaveBeenCalled();
    expect(component.noRunnersSelected).toHaveBeenCalled();
    expect(testRunnerOne.startTimer).toHaveBeenCalledWith(testDate);
    expect(testRunnerTwo.startTimer).not.toHaveBeenCalled();
    expect(testRunnerThree.startTimer).not.toHaveBeenCalled();
  });

  it('alerts the user if no runners can be started', () => {
    let testDate = new Date();
    component.runnerList = [testRunnerOne, testRunnerTwo, testRunnerThree];
    spyOn(testRunnerOne, 'startTimer');
    spyOn(testRunnerTwo, 'startTimer');
    spyOn(testRunnerThree, 'startTimer');
    spyOn(testRunnerOne, 'isRunning').and.returnValue(true);
    spyOn(testRunnerTwo, 'isRunning').and.returnValue(true);
    spyOn(testRunnerThree, 'isRunning').and.returnValue(true);
    testRunnerOne.isSelected = false;
    testRunnerTwo.isSelected = false;
    testRunnerThree.isSelected = false;
    spyOn(component, 'getStartTime').and.returnValue(testDate);
    spyOn(component, 'selectedRunners').and.callThrough();
    spyOn(component, 'noRunnersSelected').and.callThrough();
    spyOn(window, 'alert');

    component.groupStart();
    expect(window.alert).toHaveBeenCalledWith('All runners currently running.');
    expect(testRunnerOne.startTimer).not.toHaveBeenCalled();
    expect(testRunnerTwo.startTimer).not.toHaveBeenCalled();
    expect(testRunnerThree.startTimer).not.toHaveBeenCalled();

    testRunnerThree.isSelected = true;

    component.groupStart();
    expect(window.alert).toHaveBeenCalledWith('All selected runners currently running.');
    expect(testRunnerOne.startTimer).not.toHaveBeenCalled();
    expect(testRunnerTwo.startTimer).not.toHaveBeenCalled();
    expect(testRunnerThree.startTimer).not.toHaveBeenCalled();
  });

  it('knows if no runners are selected', () => {
    spyOn(component, 'selectedRunners').and.returnValue([]);

    expect(component.noRunnersSelected()).toBe(true);
  });

  it('knows if runners are selected', () => {
    spyOn(component, 'selectedRunners').and.returnValue([testRunnerOne]);

    expect(component.noRunnersSelected()).toBe(false);
  });

  it('returns the list of selected runners', () => {
    component.runnerList = [testRunnerOne, testRunnerTwo, testRunnerThree];
    expect(component.selectedRunners().length).toBe(0);
    testRunnerOne.isSelected = true;

    expect(component.selectedRunners().length).toBe(1);
    expect(component.selectedRunners().indexOf(testRunnerOne) > -1).toBe(true);

    testRunnerOne.isSelected = false;
    testRunnerTwo.isSelected = true;
    testRunnerThree.isSelected = true;

    expect(component.selectedRunners().length).toBe(2);
    expect(component.selectedRunners().indexOf(testRunnerTwo) > -1).toBe(true);
    expect(component.selectedRunners().indexOf(testRunnerThree) > -1).toBe(true);
  });
});
