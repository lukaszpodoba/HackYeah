// feed-ui.service.ts
import { Injectable, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { TReport } from '../model/feed.model';
import { FeedCardComponent } from '../dumb-components/feed-card-component/feed-card-component';

@Injectable({ providedIn: 'root' })
export class FeedUiService {
  private bottomSheet = inject(MatBottomSheet);
  private breakpoint = inject(BreakpointObserver);

  openReport(report: TReport) {
    const isHandset = this.breakpoint.isMatched([Breakpoints.Handset, Breakpoints.Small]);

    if (isHandset) {
      this.bottomSheet.open(FeedCardComponent, {
        data: report,
        panelClass: 'rounded-t-2xl',
      });
      return;
    }

    // DESKTOP/TABLET → pokaż panel boczny i przewiń listę do elementu
    const side = document.getElementById('side-panel');
    side?.classList.remove('hidden');

    const list = document.getElementById('report-list');
    const el = list?.querySelector<HTMLElement>(`[data-report-id="${report.id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Krótkie podświetlenie
      el.classList.add('ring-2', 'ring-primary', 'rounded-lg');
      setTimeout(() => el.classList.remove('ring-2', 'ring-primary', 'rounded-lg'), 1200);
    }
  }
}
