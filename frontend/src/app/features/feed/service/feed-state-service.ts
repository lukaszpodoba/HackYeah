// feed-state-service.ts
import { computed, Injectable, signal } from '@angular/core';
import { TReport } from '../model/feed.model';
import { FeedService } from './feed-service';
import { ID } from '../../../core/models/util.model';

@Injectable({ providedIn: 'root' })
export class FeedStateService {
  readonly reports = signal<TReport[]>([]);

  // sortowanie „jak Yanosik”: po (up - down), potem nowsze
  readonly sortedByScore = computed<TReport[]>(() => {
    return [...this.reports()].sort((a, b) => {
      const as = (a.like_total ?? 0) - (a.dislike_total ?? 0);
      const bs = (b.like_total ?? 0) - (b.dislike_total ?? 0);
      if (bs !== as) return bs - as;
      return new Date(b.report_time).getTime() - new Date(a.report_time).getTime();
    });
  });

  constructor(private readonly feedService: FeedService) {}

  load(center: [number, number]) {
    const data = this.feedService.getReports(center).subscribe((data) => this.reports.set(data));
  }

  vote(reportId: ID, value: 1 | -1) {
    this.feedService.vote(reportId, value);
  }
}
