import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { Runner } from '../model/runner';

import { RunnerComponent } from './runner.component';

describe('RunnerComponent', () => {
  let component: RunnerComponent;
  let fixture: ComponentFixture<RunnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RunnerComponent ],
      imports: [ FormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RunnerComponent);
    component = fixture.componentInstance;
    component.runner = new Runner('Test');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
