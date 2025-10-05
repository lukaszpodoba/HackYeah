// feed-service.ts
import { inject, Injectable } from '@angular/core';
import { TReport } from '../model/feed.model';
import { ID } from '../../../core/models/util.model';
import { Observable, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class FeedService {
  readonly URL = `http://127.0.0.1:8000/forms/?limit=100&offset=0`;
  private store = new Map<ID, TReport>();
  private http = inject(HttpClient);

  /**
   * Pobiera raporty z backendu na podstawie środka mapy i promienia.
   * GET {API}/reports?lng=..&lat=..&radiusKm=..
   */
  getReports(center: [number, number], radiusKm = 6, limit = 50): Observable<TReport[]> {
    const [lng, lat] = center;

    return this.http
      .get<TReport[]>(this.URL)
      .pipe(tap((list) => list.forEach((r) => this.store.set(r.id, r))));
  }

  /**
   * Głosowanie jak w Yanosiku (1 = up, -1 = down).
   * POST {API}/reports/{id}/vote  body: { value: 1 | -1 }
   * Zwraca zaktualizowany raport (serwerowa prawda).
   */

  // http://127.0.0.1:8000/2/like

  vote(reportId: ID, value: 1 | -1): void {
    const url = `http://127.0.0.1:8000/${reportId}/${value > 0 ? 'like' : 'dislike'}`;
    this.http
      .put<TReport>(url, { value })
      .pipe(tap((report) => this.store.set(report.id, report)))
      .subscribe();
  }

  getFromStore(reportId: ID): TReport | undefined {
    return this.store.get(reportId);
  }
}
