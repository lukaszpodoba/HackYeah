// favorites.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, of, Observable, tap } from 'rxjs';
import { ID } from '../../../core/models/util.model';
import { TReport } from '../../feed/model/feed.model';

export interface FavoriteLineSummary {
  line_id: ID;
  forms: TReport[];
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private http = inject(HttpClient);

  private favoriteLinesCache = new Map<ID, FavoriteLineSummary[]>();

  getFavoriteLines$(): Observable<FavoriteLineSummary[]> {
    return this.http.get<FavoriteLineSummary[]>('http://127.0.0.1:8000/users/9/lines/reports');
  }

  removeFavorite$(lineId: ID): Observable<void> {
    return of(void 0).pipe(delay(150));
  }
}
