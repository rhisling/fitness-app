import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from "@angular/core";
import { Meal } from "../../../shared/services/meals/meals.service";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormControlName,
  Validators
} from "@angular/forms";

@Component({
  selector: "meal-form",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["meal-form.component.scss"],
  template: `
    <div class="meal-form">
      <form [formGroup]="form">
        <div class="meal-form__name">
          <label for="">
            <h3>Meal Name</h3>
            <input
              type="text"
              placeholder="e.g. English Breakfast"
              formControlName="name"
            />
            <div class="error" *ngIf="required">
              Workout name is required
            </div>
          </label>
        </div>
        <div class="meal-form__food">
          <div class="meal-form__subtitle">
            <h3>Food</h3>
            <button
              type="button"
              class="meal-form__add"
              (click)="addIngredient()"
            >
              <img src="/img/add-white.svg" alt="" />
              Add Food
            </button>
          </div>
          <div formArrayName="ingredients">
            <label *ngFor="let c of ingredients.controls; index as i">
              <input [formControlName]="i" placeholder="eg. Eggs" />
              <span class="meal-form__remove" (click)="removeIngredients(i)">
              </span>
            </label>
          </div>
        </div>
        <div class="meal-form__submit">
          <div>
            <button type="button"  *ngIf="!exists" class="button" (click)="createMeal()">
              Create meal
            </button> 
              <button type="button" *ngIf="exists" class="button" (click)="updateMeal()">
              Save
            </button>
            <a class="button button--cancel" [routerLink]="['../']">Cancel</a>
          </div>
          <div class="meal-form__delete" *ngIf="exists">
            <div *ngIf="toggled">
              <p>Delete item?</p>
              <button type="button" class="confirm" (click)="removeMeal()">
                Yes
              </button>
              <button type="button" class="cancel" (click)="toggle()">
                No
              </button>
            </div>
            <button
              class="button button--delete"
              type="button"
              (click)="toggle()"
            >
              Delete
            </button>
          </div>
        </div>
      </form>
    </div>
  `
})
export class MealFormComponent implements OnChanges {
  toggled = false;
  exists = false;

  @Output()
  create: EventEmitter<Meal> = new EventEmitter<Meal>();

  @Input()
  meal: Meal;

  @Output()
  update: EventEmitter<Meal> = new EventEmitter<Meal>();

  @Output()
  remove: EventEmitter<Meal> = new EventEmitter<Meal>();

  ngOnChanges(changes: SimpleChanges): void {
    if (this.meal && this.meal.name) {
      this.exists = true;
      const value = this.meal;
      this.form.patchValue(value);
      this.emptyIngredients();

      if (value.ingredients) {
        for (const item of value.ingredients) {
          this.ingredients.push(new FormControl(item));
        }
      }
    }
  }

  form = this.fb.group({
    name: ["", Validators.required],
    ingredients: this.fb.array([""])
  });

  constructor(private fb: FormBuilder) {}

  get ingredients() {
    return this.form.get("ingredients") as FormArray;
  }

  get required() {
    return (
      this.form.get("name").hasError("required") &&
      this.form.get("name").touched
    );
  }

  addIngredient() {
    this.ingredients.push(new FormControl(""));
  }

  createMeal() {
    if (this.form.valid) {
      this.create.emit(this.form.value);
    }
  }

  updateMeal() {
    if (this.form.valid) {
      this.update.emit(this.form.value);
    }
  }

  removeMeal() {
      this.remove.emit(this.form.value);
  }

  removeIngredients(index: number) {
    this.ingredients.removeAt(index);
  }

  toggle() {
    this.toggled = !this.toggled;
  }


  private emptyIngredients() {
    while (this.ingredients.controls.length) {
      this.ingredients.removeAt(0);
    }
  }
}
