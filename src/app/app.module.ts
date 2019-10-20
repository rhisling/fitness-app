import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";

import { Store } from "store";

// feature modules
import { AuthModule } from "../auth/auth.module";
import { HealthModule } from "../health/health.module";

// containers
import { AppComponent } from "./containers/app/app.component";

// components
import { AppNavComponent } from "./components/app-nav/app-nav.component";
import { AppHeaderComponent } from "./components/app-header/app-header.component";

// routes
export const ROUTES: Routes = [];

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot(ROUTES), AuthModule, HealthModule],
  declarations: [AppComponent, AppNavComponent, AppHeaderComponent],
  providers: [Store],
  bootstrap: [AppComponent]
})
export class AppModule {}
