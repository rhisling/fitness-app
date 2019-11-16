import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { Store } from 'store';

import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

import { tap, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { AuthService } from '../../../../auth/shared/services/auth/auth.service';

import { Meal } from '../meals/meals.service';
import { Workout } from '../workouts/workouts.service';

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
  snacks?: ScheduleItem;
  [key: string]: any;
}

@Injectable()
export class ScheduleService {
  private date$ = new BehaviorSubject(new Date());
  private section$ = new Subject();
  private itemList$ = new Subject();

  items$ = this.itemList$.pipe(
    withLatestFrom(this.section$),
    map(([items, section]: any[]) => {
      const id = section.data.$key;
      const defaults: ScheduleItem = {
        workouts: null,
        meals: null,
        section: section.section,
        timestamp: new Date(section.day).getTime(),
      };

      const payload = {
        ...(id ? section.data : defaults),
        ...items,
      };
      if (id) {
        return this.updateSection(id, payload);
      } else {
        return this.createSection(payload);
      }
    })
  );

  selected$ = this.section$.pipe(
    tap((next: any) => this.store.set('selected', next))
  );

  list$ = this.section$.pipe(
    map((value: any) => this.store.value[value.type]),
    tap((next: any) => this.store.set('list', next))
  );

  schedule$: Observable<ScheduleItem[]> = this.date$.pipe(
    tap((next: any) => this.store.set('date', next)),
    map((day: any) => {
      const startAt = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate()
      ).getTime();

      const endAt =
        new Date(
          day.getFullYear(),
          day.getMonth(),
          day.getDate() + 1
        ).getTime() - 1;

      return { startAt, endAt };
    }),
    switchMap(({ startAt, endAt }: any) => this.getSchedule(startAt, endAt)),
    map((data: any) => {
      const mapped: ScheduleList = {};
      for (const prop of data) {
        if (!mapped[prop.payload.val().section]) {
          mapped[prop.payload.val().section] = {
            ...prop.payload.val(),
            $key: prop.key,
          };
        }
      }
      return mapped;
    }),
    tap((next: any) => this.store.set('schedule', next))
  );

  constructor(
    private store: Store,
    private authService: AuthService,
    private db: AngularFireDatabase
  ) {}

  get uid() {
    return this.authService.user.uid;
  }

  updateItems(items: string[]) {
    console.log('Updating items:' + JSON.stringify(items));
    this.itemList$.next(items);
  }

  updateDate(date: Date) {
    this.date$.next(date);
  }

  selectSection(event: any) {
    this.section$.next(event);
  }

  private createSection(payload: ScheduleItem) {
    return this.db.list(`schedule/${this.uid}`).push(payload);
  }

  private updateSection(key: string, payload: ScheduleItem) {
    delete payload.$key;
    return this.db.object(`schedule/${this.uid}/${key}`).update(payload);
  }

  private getSchedule(startAt: number, endAt: number) {
    return this.db
      .list(`schedule/${this.uid}`, ref =>
        ref
          .orderByChild('timestamp')
          .startAt(startAt)
          .endAt(endAt)
      )
      .snapshotChanges();
  }
}
