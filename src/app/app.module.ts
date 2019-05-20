import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RunnerComponent } from './runner/runner.component';
import { WorkoutComponent } from './workout/workout.component';
import { SplitDetailsComponent } from './split-details/split-details.component';

@NgModule({
  declarations: [
    AppComponent,
    RunnerComponent,
    WorkoutComponent,
    SplitDetailsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
