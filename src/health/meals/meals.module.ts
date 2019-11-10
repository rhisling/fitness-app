import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

//components
import { MealFormComponent } from "./components/meal-form/meal-form.component";

//containers
import { MealComponent } from "./containers/meal/meal.component";
import { MealsComponent } from "./containers/meals/meals.component";
import { SharedModule } from "../shared/shared.module";

export const ROUTES: Routes = [
  {
    path: "",
    component: MealsComponent
  },
  {
    path: "new",
    component: MealComponent
  },
  {
    path: ":id",
    component: MealComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(ROUTES),
    SharedModule
  ],
  declarations: [MealsComponent, MealComponent, MealFormComponent]
})
export class MealsModule {}
