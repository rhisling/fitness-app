import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { Store } from 'store';
import {
  ScheduleItem,
  ScheduleService,
} from '../../../shared/services/schedule/schedule.service';
import {
  Meal,
  MealsService,
} from '../../../shared/services/meals/meals.service';
import {
  Workout,
  WorkoutsService,
} from '../../../shared/services/workouts/workouts.service';

@Component({
  selector: 'schedule',
  styleUrls: ['schedule.component.scss'],
  template: `
    <div class="schedule">
      <schedule-calendar
        [date]="date$ | async"
        (change)="changeDate($event)"
        [items]="schedule$ | async"
        (select)="changeSection($event)"
      >
      </schedule-calendar>
      <schedule-assign
        *ngIf="open"
        [section]="selected$ | async"
        [list]="list$ | async"
        (update)="assignItem($event)"
        (cancel)="closeAssign()"
      ></schedule-assign>
    </div>
  `,
})
export class ScheduleComponent implements OnInit, OnDestroy {
  open = false;

  date$: Observable<Date>;
  schedule$: Observable<ScheduleItem>;
  selected$: Observable<any>;
  list$: Observable<Meal[] | Workout[]>;
  subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private scheduleService: ScheduleService,
    private mealService: MealsService,
    private workoutService: WorkoutsService
  ) {}

  ngOnInit() {
    this.date$ = this.store.select<Date>('date');
    this.schedule$ = this.store.select<ScheduleItem>('schedule');
    this.selected$ = this.store.select('selected');
    this.list$ = this.store.select('list');

    this.subscriptions = [
      this.scheduleService.schedule$.subscribe(),
      this.scheduleService.selected$.subscribe(),
      this.mealService.meals$.subscribe(),
      this.workoutService.workouts$.subscribe(),
      this.scheduleService.list$.subscribe(),
      this.scheduleService.items$.subscribe(),
    ];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  changeDate(date: Date) {
    this.scheduleService.updateDate(date);
  }

  changeSection(event: any) {
    this.open = true;
    this.scheduleService.selectSection(event);
  }

  assignItem(items: string[]) {
    this.scheduleService.updateItems(items);
    this.closeAssign();
  }

  closeAssign() {
    this.open = false;
  }
}
