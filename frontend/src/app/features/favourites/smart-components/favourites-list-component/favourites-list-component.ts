// favorites-routes.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ID } from '../../../../core/models/util.model';
import { FeedCardComponent } from '../../../feed/dumb-components/feed-card-component/feed-card-component';
import { TReport } from '../../../feed/model/feed.model';
import { FavoriteLineSummary, FavoritesService } from '../../services/favorites-service';
import { tap } from 'rxjs';

type LineView = FavoriteLineSummary & {
  expanded?: boolean;
  loading?: boolean;
  reports?: TReport[];
};

@Component({
  selector: 'app-favorites-routes',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FeedCardComponent,
  ],
  templateUrl: './favourites-list-component.html',
})
export class FavoritesRoutesComponent implements OnInit {
  lines = signal<LineView[]>([]);

  constructor(private fav: FavoritesService) {}

  ngOnInit(): void {
    this.fav.getFavoriteLines$().subscribe((list) => this.lines.set(list));
  }

  toggle(line: LineView) {
    const arr = [...this.lines()];
    const idx = arr.findIndex((l) => l.lineId === line.lineId);
    if (idx === -1) return;

    const item = { ...arr[idx], expanded: !arr[idx].expanded };
    arr[idx] = item;
    this.lines.set(arr);

    if (item.expanded && !item.reports?.length) {
      this.loadReports(item.lineId);
    }
  }

  private loadReports(lineId: ID) {
    this.setLoading(lineId, true);
    this.fav
      .getReportsForLine$(lineId)
      .pipe(tap((data) => console.log(data)))
      .subscribe({
        next: (reports) => this.patchLine(lineId, { reports }),
        complete: () => this.setLoading(lineId, false),
        error: () => this.setLoading(lineId, false),
      });
  }

  remove(lineId: ID) {
    this.fav.removeFavorite$(lineId).subscribe(() => {
      this.lines.set(this.lines().filter((l) => l.lineId !== lineId));
    });
  }

  // helpers
  private setLoading(lineId: ID, loading: boolean) {
    this.patchLine(lineId, { loading });
  }
  private patchLine(lineId: ID, patch: Partial<LineView>) {
    this.lines.update((list) => list.map((l) => (l.lineId === lineId ? { ...l, ...patch } : l)));
  }
}
