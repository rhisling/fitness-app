import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Store } from "store";
import { map, tap, switchMap } from "rxjs/operators";
import { Meal } from "../meals/meals.service";
import { Workout } from "../workouts/workouts.service";
import { AngularFireDatabase } from "@angular/fire/database";
import { AuthService } from "../../../../auth/shared/services/auth/auth.service";

export interface ScheduleItem {
  meals: Meal[];
  workouts: Workout[];
  section: string;
  timestamp: number;
  $key?: string;
}

export interface ScheduleList {
  morning?: ScheduleItem;
  lunch?: ScheduleItem;
  evening?: ScheduleItem;
  snack?: ScheduleItem;
  [key: string]: any;
}

@Injectable()
export class ScheduleService {
  private date$ = new BehaviorSubject(new Date());

  schedule$: Observable<ScheduleList> = this.date$.pipe(
    tap(next => {
      console.log("next:" + next);
      this.store.set("date", next);
    }),
    map((day: any) => {
      const startAt = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      ).getTime();
      const endAt =
        new Date(day.getFullYear(), day.getMonth(), day.getDate()+ 1).getTime() -
        1;
      console.log(`startAt: ${startAt} - endAt:${endAt}`);
      return { startAt, endAt };
    }),
    switchMap(({ startAt, endAt }) => this.getSchedule(startAt, endAt)),
    map((data: any) => {
      const mapped: ScheduleList = {};
      console.log("in map", data);
      for (const prop of data) {
        if (!mapped[prop.section]) {
          mapped[prop.section] = prop;
        }
      }
      return mapped;
    }),
    tap(next => this.store.set("schedule", next))
  );

  constructor(
    private store: Store,
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {}

  updateDate(date: Date) {
    this.date$.next(date);
  }

  get uid() {
    return this.authService.user.uid;
  }

  private getSchedule(startAt: number, endAt: number) {
    return this.db
      .list(`schedule/${this.uid}`, ref =>
        ref
          .orderByChild("timestamp")
          .startAt(startAt)
          .endAt(endAt)
      )
      .valueChanges();
  }
}
