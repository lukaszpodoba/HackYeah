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
      const as = (a.votes?.up ?? 0) - (a.votes?.down ?? 0);
      const bs = (b.votes?.up ?? 0) - (b.votes?.down ?? 0);
      if (bs !== as) return bs - as;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  });

  constructor(private readonly feedService: FeedService) {}

  load(center: [number, number]) {
    const data = this.feedService.getReports(center);
    this.reports.set(data);
  }

  vote(reportId: ID, value: 1 | -1) {
    this.feedService.vote(reportId, value);
  }
}
