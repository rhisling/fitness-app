import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './containers/register/register.component';

export const ROUTES: Routes = [{ path: '', component: RegisterComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(ROUTES)],
  declarations: [RegisterComponent]
})
export class RegisterModule {}
