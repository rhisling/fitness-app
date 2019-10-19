import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { AuthService } from "../../../shared/services/auth/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "register",
  template: `
    <div>
      <auth-form (submitted)="registerUser($event)">
        <h1>Register</h1>
        <a routerLink="/auth/register">Already have an account?</a>
        <button type="submit">Create account</button>
        <div class="error" *ngIf="error">{{ error }}</div>
      </auth-form>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  error: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  async registerUser(event: FormGroup) {
    const { email, password } = event.value;
    try {
      await this.authService.createUser(email, password);
      this.router.navigate(["/"]);
    } catch (err) {
      this.error = err.message;
    }
  }
}
