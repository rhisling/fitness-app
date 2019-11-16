import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

import { Store } from 'store';
import { AuthService } from '../../../../auth/shared/services/auth/auth.service';
import { Observable, of } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

export interface Meal {
  name: string;
  ingredients: string[];
  timestamp: number;
  $key: string;
  $exists: () => boolean;
}

@Injectable()
export class MealsService {
  meals$: Observable<any[]> = this.db
    .list(`meals/${this.uid}`)
    .snapshotChanges()
    .pipe(
      tap(next =>
        this.store.set(
          'meals',
          next.map(n => ({
            ...n.payload.val(),
            $key: n.payload.key,
            $exists: n.payload.exists,
          }))
        )
      )
    );

  constructor(
    private store: Store,
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {}

  get uid() {
    return this.authService.user.uid;
  }

  addMeal(meal: Meal) {
    console.log(meal);
    return this.db.list(`meals/${this.uid}`).push(meal);
  }

  removeMeal(key: string) {
    return this.db.list(`meals/${this.uid}`).remove(key);
  }

  updateMeal(key: string, meal: Meal) {
    return this.db.object(`meals/${this.uid}/${key}`).update(meal);
  }

  getMeal(key: string) {
    if (!key) {
      return of({});
    }
    return this.store.select<Meal[]>('meals').pipe(
      filter(Boolean),
      map((meals: Meal[]) => {
        return meals.find((meal: Meal) => meal.$key === key);
      })
    );
  }
}
