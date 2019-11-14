import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'schedule-days',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['schedule-days.component.scss'],
  template: `
    <div class="days"></div>
    <button
      type="button"
      class="day"
      *ngFor="let day of days; index as i"
      (click)="selectDay(i)"
    >
      <span [class.active]="i == selected">
        {{ day }}
      </span>
    </button>
  `,
})
export class ScheduleDaysComponent {
  days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  @Input()
  selected: number;

  @Output()
  select = new EventEmitter<number>();

  constructor() {}

  selectDay(index: number) {
    this.select.emit(index);
  }
}
