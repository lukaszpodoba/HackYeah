import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ReportCategory,
  Confidence,
  ReportFilter,
  TRoute,
} from '../../../../core/models/util.model';
import { RouteViewComponent } from '../../../../shared/components/route-view-component/route-view-component';
import { StopSelectControlComponent } from '../../../../shared/components/stop-select-control-component/stop-select-control-component';

@Component({
  selector: 'app-route-planner-component',
  imports: [ReactiveFormsModule, RouteViewComponent, StopSelectControlComponent],
  templateUrl: './route-planner-component.html',
})
export class RoutePlannerComponent {
  private fb = inject(FormBuilder);

  // CVA zwraca stop_code (string)
  form = this.fb.group({
    startStopCode: [null as string | null, Validators.required],
    endStopCode: [null as string | null, Validators.required],
  });

  mainRoute = signal<TRoute | null>(null);
  alternativeRoute = signal<TRoute | null>(null);
  showAlternative = signal(false);

  reportFilter = signal<ReportFilter>({
    categories: [ReportCategory.ACCIDENT, ReportCategory.VEHICLE_FAILURE],
    minConfidence: Confidence.MEDIUM,
  });

  ngOnInit() {
    this.form.valueChanges.subscribe((value) => console.log(value));
  }

  searchRoute() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // pobierz kody
    const { startStopCode, endStopCode } = this.form.getRawValue();

    // TODO: zamiana stop_code -> stop_id jeżeli backend wymaga (np. przez mapę kod->id z serwisu)
    // Tutaj przykład makiety:
    this.mainRoute.set({
      total_cost_km: 12.34,
      stops: [
        { stop_name: 'Dworzec Główny', stop_code: startStopCode ?? 'A1' },
        { stop_name: 'Rynek', stop_code: 'B2', line_id_change_here: 12 },
        { stop_name: 'Lotnisko', stop_code: endStopCode ?? 'C3' },
      ],
      segments: [{ line_id: 8 }, { line_id: 12 }],
    });

    this.alternativeRoute.set({
      total_cost_km: 14.1,
      stops: [
        { stop_name: 'Dworzec Główny', stop_code: startStopCode ?? 'A1' },
        { stop_name: 'Uniwersytet', stop_code: 'D4', line_id_change_here: 5 },
        { stop_name: 'Lotnisko', stop_code: endStopCode ?? 'C3' },
      ],
      segments: [{ line_id: 5 }, { line_id: 2 }],
    });
  }

  toggleAlternative() {
    this.showAlternative.update((v) => !v);
  }

  getLineColor = (lineId: string | number): string => {
    const colors: Record<string, string> = {
      '2': '#9b59b6',
      '5': '#e74c3c',
      '8': '#27ae60',
      '12': '#3498db',
    };
    return colors[String(lineId)] ?? '#95a5a6';
  };
}
