import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";

//components
import { WorkoutFormComponent } from "./components/workout-form/workout-form.component";
import {WorkoutTypeComponent} from "./components/workout-type/workout-type.component";

//containers
import { WorkoutComponent } from "./containers/workout/workout.component";
import { WorkoutsComponent } from "./containers/workouts/workouts.component";



export const ROUTES: Routes = [
  {
    path: "",
    component: WorkoutsComponent
  },
  {
    path: "new",
    component: WorkoutComponent
  },
  {
    path: ":id",
    component: WorkoutComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    SharedModule
  ],
  declarations: [WorkoutsComponent, WorkoutComponent, WorkoutFormComponent, WorkoutTypeComponent]
})
export class WorkoutsModule {}
