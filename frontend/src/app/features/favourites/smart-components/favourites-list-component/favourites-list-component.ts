// favorites-routes.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ID } from '../../../../core/models/util.model';
import { FeedCardComponent } from '../../../feed/dumb-components/feed-card-component/feed-card-component';
import { TReport } from '../../../feed/model/feed.model';
import { FavoriteLineSummary, FavoritesService } from '../../services/favorites-service';
import { tap } from 'rxjs';
import { FeedStateService } from '../../../feed/service/feed-state-service';

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
  lines = signal<FavoriteLineSummary[]>([]);

  readonly state = inject(FeedStateService);

  constructor(private fav: FavoritesService) {}

  ngOnInit(): void {
    this.fav
      .getFavoriteLines$()
      .pipe(tap((data) => console.log(data)))
      .subscribe((list) => this.lines.set(list));
  }

  onVote(e: { reportId: string; value: 1 | -1 }) {
    this.state.vote(e.reportId as any, e.value);
  }

  remove(lineId: ID) {
    this.fav.removeFavorite$(lineId).subscribe(() => {
      this.lines.set(this.lines().filter((l) => l.line_id !== lineId));
    });
  }
}
