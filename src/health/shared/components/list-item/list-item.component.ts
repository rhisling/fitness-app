import { Component, Input } from "@angular/core";
import { Meal } from "../../services/meals/meals.service";

@Component({
  selector: "list-item",
  styleUrls: ["list-item.component.scss"],
  template: `
    <div class="list-item">
      {{ item | json }}
    </div>
  `
})
export class ListItemComponent {
  @Input()
  item: any;

  constructor() {}
}
