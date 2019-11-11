import { Component, OnDestroy, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Subscription } from "rxjs";
import { Store } from "store";
import { ScheduleService } from "../../../shared/services/schedule/schedule.service";

@Component({
  selector: "workouts",
  styleUrls: ["schedule.component.scss"],
  template: `
    <div class="schedule">
      <schedule-calendar [date]="date$ | async" (change)="changeDate($event)">
      </schedule-calendar>
    </div>
  `
})
export class ScheduleComponent implements OnInit, OnDestroy {
  date$: Observable<Date>;
  subscriptions: Subscription[] = [];

  constructor(private store: Store, private scheduleService: ScheduleService) {}

  ngOnInit() {
    this.date$ = this.store.select<Date>("date");
    this.subscriptions = [this.scheduleService.schedule$.subscribe()];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  changeDate(date: Date) {
    this.scheduleService.updateDate(date);
  }
}
