// favorites.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, of, Observable, tap } from 'rxjs';
import { ID } from '../../../core/models/util.model';
import { ReportCategory, ReportSource, Confidence, ISODate } from '../../../core/models/util.model';
import { TReport } from '../../feed/model/feed.model';

export type LineMode = 'BUS' | 'TRAM';
export interface FavoriteLineSummary {
  lineId: ID;
  label: string;
  mode: LineMode;
  reportCount: number;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private http = inject(HttpClient);

  private reportsCache = new Map<ID, TReport[]>();

  getFavoriteLines$(): Observable<FavoriteLineSummary[]> {
    const data: FavoriteLineSummary[] = [
      { lineId: '147' as ID, label: 'Linia 147', mode: 'BUS', reportCount: 2 },
      { lineId: '9' as ID, label: 'Tramwaj 9', mode: 'TRAM', reportCount: 2 },
      { lineId: '195' as ID, label: 'Linia 195', mode: 'BUS', reportCount: 1 },
    ];
    return of(data).pipe(delay(200));
  }

  getReportsForLine$(lineId: ID): Observable<TReport[]> {
    // const fromCache = this.reportsCache.get(lineId);
    // if (fromCache) return of(fromCache);

    return this.http
      .get<TReport[]>('http://127.0.0.1:8000/reports/forms/user/8')
      .pipe(tap((reports) => this.reportsCache.set(lineId, reports)));
  }

  removeFavorite$(lineId: ID): Observable<void> {
    return of(void 0).pipe(delay(150));
  }
}
