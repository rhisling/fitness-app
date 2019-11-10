import { Injectable } from "@angular/core";
import { AngularFireDatabase } from "@angular/fire/database";

import { Store } from "store";
import { AuthService } from "../../../../auth/shared/services/auth/auth.service";
import { Observable, of } from "rxjs";
import { tap, map, filter } from "rxjs/operators";

export interface Workout {
  name: string;
  type: string; // endurance | strength
  strength: any;
  endurance: any;
  timestamp: number;
  $key: string;
  $exists: () => boolean;
}

@Injectable()
export class WorkoutsService {
  workouts$: Observable<any[]> = this.db
    .list(`workouts/${this.uid}`)
    .snapshotChanges()
    .pipe(
      tap(next =>
        this.store.set(
          "workouts",
          next.map(n => ({
            ...n.payload.val(),
            $key: n.payload.key,
            $exists: n.payload.exists
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

  addMeal(workout: Workout) {
    console.log(workout);
    return this.db.list(`workouts/${this.uid}`).push(workout);
  }

  removeMeal(key: string) {
    return this.db.list(`workouts/${this.uid}`).remove(key);
  }

  updateMeal(key: string, workout: Workout){
    return this.db.object(`workouts/${this.uid}/${key}`).update(workout);
  }

  getMeal(key: string) {
    if (!key) return of({});
    return this.store.select<Workout[]>("workouts").pipe(
      map(workouts => {
        return workouts.find(meal => meal.$key === key);
      })
    );
  }


}