import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { AngularFireDatabaseModule } from "@angular/fire/database";

//components
import { ListItemComponent } from "./components/list-item/list-item.component";

//services
import { MealsService } from "./services/meals/meals.service";
import { WorkoutsService } from "./services/workouts/workouts.service";

//pipes
import { JoinPipe } from "./pipes/join.pipe";
import {WorkoutPipePipe} from "./pipes/workout.pipe";

@NgModule({
  imports: [CommonModule, RouterModule, AngularFireDatabaseModule],
  declarations: [ListItemComponent, JoinPipe, WorkoutPipePipe],
  exports: [ListItemComponent, JoinPipe, WorkoutPipePipe]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [MealsService, WorkoutsService]
    };
  }
}
