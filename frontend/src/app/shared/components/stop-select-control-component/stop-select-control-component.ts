import { Component, forwardRef, inject, Input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LocationStopsService, StopDto } from '../../../core/location-stops/location-stops-service';

@Component({
  selector: 'app-stop-select-control-component',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StopSelectControlComponent),
      multi: true,
    },
  ],
  templateUrl: './stop-select-control-component.html',
})
export class StopSelectControlComponent implements ControlValueAccessor {
  private stopsSvc = inject(LocationStopsService);

  @Input() label = 'Przystanek';
  @Input() placeholder = 'Wybierz przystanek';

  // STATE
  stops = signal<StopDto[]>([]);
  stopsLoaded = signal(false);
  stopsLoading = signal(false);
  stopsError = signal<string | null>(null);

  // CVA
  disabled = signal(false);
  private onChange: (val: number | null) => void = () => {};
  private onTouched: () => void = () => {};
  value = signal<number | null>(null); // <- stop_code

  // API
  writeValue(code: number | null): void {
    this.value.set(code);
  }
  registerOnChange(fn: (val: number | null) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  // Handlers
  loadStopsIfNeeded() {
    if (this.stopsLoaded() || this.stopsLoading()) return;
    this.stopsLoading.set(true);
    this.stopsError.set(null);
    this.stopsSvc.listStops().subscribe({
      next: (list) => {
        this.stops.set(list);
        this.stopsLoaded.set(true);
        this.stopsLoading.set(false);
      },
      error: () => {
        this.stopsError.set('Nie udało się pobrać listy przystanków.');
        this.stopsLoading.set(false);
      },
    });
  }

  onSelectChange(e: Event) {
    const code = +(e.target as HTMLSelectElement).value || null;
    this.value.set(code);
    this.onChange(code);
    this.onTouched();
  }
}
