// favorites.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, of, Observable } from 'rxjs';
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
    const fromCache = this.reportsCache.get(lineId);
    if (fromCache) return of(fromCache);

    const now = new Date().toISOString() as ISODate;
    const lipsum = [
      'Czekam już 20 minut na przystanku Centrum.',
      'Kolejne opóźnienie na tej linii. Brak informacji o przyczynie.',
      'Zablokowany wjazd na pętlę — korek.',
      'Usterka drzwi, pojazd stoi na przystanku.',
    ];

    const count = lineId === '147' ? 2 : lineId === '9' ? 2 : 1;
    const reports: TReport[] = Array.from({ length: count }, (_, i) => ({
      id: `${lineId}-r${i + 1}` as ID,
      title: i % 2 ? `Opóźnienie 15 minut na tej samej linii` : `Autobus nie przyjechał o 14:30`,
      description: lipsum[(i + lineId.length) % lipsum.length],
      source: i % 2 ? ReportSource.USER : ReportSource.SYSTEM,
      category: ReportCategory.OTHER,
      confidence: i % 2 ? Confidence.LOW : Confidence.VERIFIED,
      createdAt: now,
      updatedAt: now,
      location: [19.94 + i * 0.002, 50.06 + i * 0.002],
      placeName: i % 2 ? 'Plac Zbawiciela' : 'Centrum, Dworzec PKP',
      lineId,
      connectionId: undefined,
      author: { id: ('u' + i) as ID, role: 'USER', displayName: 'Użytkownik' },
      votes: { up: 5 + i, down: i, my: 0 },
    }));

    this.reportsCache.set(lineId, reports);
    return of(reports).pipe(delay(250));
  }

  removeFavorite$(lineId: ID): Observable<void> {
    return of(void 0).pipe(delay(150));
  }
}
