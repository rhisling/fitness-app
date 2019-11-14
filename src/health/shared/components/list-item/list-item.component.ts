import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Meal } from '../../services/meals/meals.service';

@Component({
  selector: 'list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['list-item.component.scss'],
  template: `
    <div class="list-item">
      <a [routerLink]="getRoute(item)">
        <p class="list-item__name">
          {{ item.name }}
        </p>
        <p class="list-item__ingredients">
          <span *ngIf="item.ingredients; else showWorkout">
            {{ item.ingredients | join }}
          </span>
        </p>
        <ng-template #showWorkout>
          <span>{{ item | workout }}</span>
        </ng-template>
      </a>
      <div class="list-item__delete" *ngIf="toggled">
        <p>Delete item?</p>
        <button type="button" class="confirm" (click)="removeItem()">
          Yes
        </button>
        <button type="button" class="cancel" (click)="toggle()">No</button>
      </div>
      <button class="trash" type="button" (click)="toggle()">
        <img src="./assets/img/remove.svg" />
      </button>
    </div>
  `,
})
export class ListItemComponent {
  @Input()
  item: any;

  @Output()
  remove = new EventEmitter<any>();

  toggled = false;

  constructor() {}

  getRoute(item: any) {
    return [`../${item.ingredients ? 'meals' : 'workouts'}`, item.$key];
  }

  removeItem() {
    this.remove.emit(this.item);
  }

  toggle() {
    this.toggled = !this.toggled;
  }
}
