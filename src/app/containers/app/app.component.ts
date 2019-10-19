import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
      <div>
          Hello Ultimate Angular!
          <div class="wrapper">
              <router-outlet></router-outlet>
          </div>
      </div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor() {
  }
}
