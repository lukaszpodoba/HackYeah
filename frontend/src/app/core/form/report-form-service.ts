import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ID, ISODate, ReportCategory } from '../models/util.model';

export interface Stop {
  id: ID;
  name: string;
}

export interface CreateReportPayload {
  createdAt: ISODate;
  stopId: ID;
  category: ReportCategory;
  lineNumber: string;
  delayMinutes?: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class ReportFormService {
  getStops$(): Observable<Stop[]> {
    const stops: Stop[] = [
      { id: 'stop-1' as ID, name: 'Centrum, Dworzec PKP' },
      { id: 'stop-2' as ID, name: 'Plac Zbawiciela' },
      { id: 'stop-3' as ID, name: 'Rondo Grunwaldzkie' },
    ];
    return of(stops).pipe(delay(200));
  }

  saveReport$(payload: CreateReportPayload): Observable<{ ok: true; id: ID }> {
    return of({ ok: true, id: ('rep-' + Math.random().toString(36).slice(2)) as ID });
  }
}
