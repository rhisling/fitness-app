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

  addWorkout(workout: Workout) {
    console.log(workout);
    return this.db.list(`workouts/${this.uid}`).push(workout);
  }

  removeWorkout(key: string) {
    return this.db.list(`workouts/${this.uid}`).remove(key);
  }

  updateWorkout(key: string, workout: Workout) {
    return this.db.object(`workouts/${this.uid}/${key}`).update(workout);
  }

  getWorkout(key: string) {
    if (!key) return of({});
    return this.store.select<Workout[]>("workouts").pipe(
      tap(next => console.log("In-tap:" + JSON.stringify(next))),
      filter(Boolean),
      map((workouts: Workout[]) => {
        return workouts.find((workout: Workout) => workout.$key === key);
      })
    );
  }
}
