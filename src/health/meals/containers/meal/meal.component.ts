import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Meal,
  MealsService,
} from '../../../shared/services/meals/meals.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'meal',
  styleUrls: ['meal.component.scss'],
  template: `
    <div class="meal">
      <div class="meal__title">
        <h1>
          <img src="/assets/food.svg" alt="" />
          <span *ngIf="meal$ | async as meal; else title"
            >{{ meal.name ? 'Edit' : 'Create' }} meal</span
          >
          <ng-template #title>
            Loading ...
          </ng-template>
        </h1>
      </div>
      <div *ngIf="meal$ | async as meal; else loading">
        <meal-form
          [meal]="meal"
          (create)="addMeal($event)"
          (update)="updateMeal($event)"
          (remove)="removeMeal($event)"
        ></meal-form>
      </div>
      <ng-template #loading>
        <div class="message">
          <img src="./img/loading.svg" alt="" />
        </div>
      </ng-template>
    </div>
  `,
})
export class MealComponent implements OnInit, OnDestroy {
  meal$: Observable<void | {}>;
  subscription: Subscription;

  constructor(
    private mealsService: MealsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscription = this.mealsService.meals$.subscribe();
    this.meal$ = this.route.params.pipe(
      switchMap(param => {
        return this.mealsService.getMeal(param.id);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async addMeal(event: Meal) {
    await this.mealsService.addMeal(event);
    console.log('workout added');
    this.backToMeals();
  }

  private backToMeals() {
    this.router.navigate(['meals']);
  }

  async updateMeal(event: Meal) {
    const key = this.route.snapshot.params.id;
    await this.mealsService.updateMeal(key, event);
    this.backToMeals();
  }

  async removeMeal(event: Meal) {
    const key = this.route.snapshot.params.id;
    await this.mealsService.removeMeal(key);
    this.backToMeals();
  }
}
