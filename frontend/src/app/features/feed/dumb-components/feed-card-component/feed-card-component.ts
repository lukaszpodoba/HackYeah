import { Component, Input, input, output } from '@angular/core';
import { TReport } from '../../model/feed.model';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ReportCategory } from '../../../../core/models/util.model';
import { TimeAgoPipe } from '../../../../shared/pipe/time-ago.pipe';

@Component({
  selector: 'app-feed-card-component',
  imports: [MatCardModule, MatButtonModule, MatChipsModule, MatIconModule, TimeAgoPipe],
  templateUrl: './feed-card-component.html',
})
export class FeedCardComponent {
  @Input({ required: true }) report!: TReport;

  vote = output<{ reportId: string; value: 1 | -1 }>();
  cardClick = output<void>();

  categoryColors: Record<ReportCategory, string> = {
    [ReportCategory.ACCIDENT]: 'bg-chart-3 text-white',
    [ReportCategory.ROADWORKS]: 'bg-destructive text-destructive-foreground',
    [ReportCategory.VEHICLE_FAILURE]: 'bg-chart-4 text-white',
    [ReportCategory.OTHER]: 'bg-chart-2 text-white',
  };

  categoryMessage: Record<ReportCategory, string> = {
    [ReportCategory.ROADWORKS]: 'Opóźnienie z powodu robót drogowych',
    [ReportCategory.VEHICLE_FAILURE]: 'Opóźnienie z powodu awarii pojazdu',
    [ReportCategory.ACCIDENT]: 'Opóźnienie z powodu wypadku/kolizji',
    [ReportCategory.OTHER]: 'Opóźnienie z innego powodu',
  };

  colorClassFor(category: ReportCategory): string {
    return this.categoryColors[category] || this.categoryColors[ReportCategory.OTHER];
  }

  onCardClick() {
    this.cardClick.emit();
  }

  onVoteClick(e: MouseEvent, value: 1 | -1) {
    e.stopPropagation();
    this.vote.emit({ reportId: this.report.id, value });
  }
}
