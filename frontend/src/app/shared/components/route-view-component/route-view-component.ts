import { Component, Input } from '@angular/core';
import { TRoute } from '../../../core/models/util.model';

@Component({
  selector: 'app-route-view-component',
  imports: [],
  templateUrl: './route-view-component.html',
})
export class RouteViewComponent {
  @Input({ required: true }) route!: TRoute;
  @Input() title = 'Trasa';
  @Input() accent = 'emerald-600';
  @Input({ required: true }) getLineColor!: (id: string | number) => string;

  get borderClass() {
    return `border-l-4 border-${this.accent}`;
  }
}
