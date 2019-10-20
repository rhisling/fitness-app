import { Component, OnDestroy, OnInit, ViewEncapsulation } from "@angular/core";

import { Observable } from "rxjs";
import { Subscription } from "rxjs";

import { Store } from "store";

import { AuthService } from "../../../auth/shared/services/auth/auth.service";
import { User } from "firebase";

@Component({
  selector: "app-root",
  template: `
    <div>
      <h1>{{ user$ | async | json }}</h1>
      <div class="wrapper">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  subscription: Subscription;

  constructor(private store: Store, private authService: AuthService) {}

  ngOnInit() {
    this.subscription = this.authService.auth$.subscribe();
    this.user$ = this.store.select<User>("user");
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
