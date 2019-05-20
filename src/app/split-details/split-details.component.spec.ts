import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { Lap } from '../model/lap';
import { Runner } from '../model/runner';
import { Split } from '../model/split';

import { SplitDetailsComponent } from './split-details.component';

describe('SplitDetailsComponent', () => {
  let component: SplitDetailsComponent;
  let fixture: ComponentFixture<SplitDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitDetailsComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitDetailsComponent);
    component = fixture.componentInstance;
    component.runner = new Runner('Test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return the formatted lap list of the runner', () => {
    let testFormattedLapOne = '00:58.1';
    let testFormattedLapTwo = '00:57.4';
    let testFormattedLapThree = '00:59.3';
    let testSplit = new Split(0, []);
    testSplit.lapList = [
      new Lap(0, testFormattedLapOne),
      new Lap(0, testFormattedLapTwo),
      new Lap(0, testFormattedLapThree)
    ];

    expect(component.lapList(testSplit)).toBe('00:58.1, 00:57.4, 00:59.3');
  });
});
