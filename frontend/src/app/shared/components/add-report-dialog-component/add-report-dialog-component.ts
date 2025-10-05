// add-report-dialog.component.ts
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ReportCategory, ISODate } from '../../../core/models/util.model';
import {
  ReportFormService,
  Stop,
  CreateReportPayload,
} from '../../../core/form/report-form-service';

@Component({
  selector: 'app-add-report-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './add-report-dialog-component.html',
})
export class AddReportDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<AddReportDialogComponent>);
  private service = inject(ReportFormService);
  private snack = inject(MatSnackBar);

  stops = signal<Stop[]>([]);
  saving = signal(false);

  readonly categoryLabels: Record<ReportCategory, string> = {
    [ReportCategory.ROADWORKS]: 'Prace drogowe',
    [ReportCategory.VEHICLE_FAILURE]: 'Awaria pojazdu',
    [ReportCategory.ACCIDENT]: 'Wypadek',
    [ReportCategory.OTHER]: 'Inne',
  };
  categoryOptions = computed(() =>
    (Object.values(ReportCategory) as ReportCategory[]).map((value) => ({
      value,
      label: this.categoryLabels[value],
    }))
  );

  form = this.fb.group({
    createdAt: [new Date().toISOString() as ISODate],
    stopId: ['', Validators.required],
    category: [ReportCategory.OTHER, Validators.required],
    lineNumber: ['', Validators.required],
    delayMinutes: [null as number | null, []],
  });

  ngOnInit(): void {
    this.service.getStops$().subscribe((s) => this.stops.set(s));
  }

  nowHuman(): string {
    return new Date(this.form.value.createdAt as string).toLocaleString('pl-PL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);

    const payload = this.form.getRawValue() as CreateReportPayload;

    this.service.saveReport$(payload).subscribe({
      next: () => {
        this.snack.open('Zgłoszenie zapisane ✅', undefined, { duration: 2000 });
        this.dialogRef.close(payload);
      },
      error: () => {
        this.snack.open('Nie udało się zapisać zgłoszenia ❌', undefined, { duration: 2500 });
      },
      complete: () => this.saving.set(false),
    });
  }
}
