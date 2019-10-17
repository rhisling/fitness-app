import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthFormComponent } from './containers/auth-form/auth-form';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [],
  exports: [AuthFormComponent]
})
export class SharedModule {}
