import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { AddReportDialogComponent } from './shared/components/add-report-dialog-component/add-report-dialog-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, RouterLink, RouterLinkActive, MatDividerModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('frontend');

  private dialog = inject(MatDialog);
  openAddDialog() {
    this.dialog.open(AddReportDialogComponent, {
      width: '520px',
      autoFocus: false,
      disableClose: true,
    });
  }
}
