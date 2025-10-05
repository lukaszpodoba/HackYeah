import { inject, Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ID, ISODate, ReportCategory } from '../models/util.model';
import { HttpClient } from '@angular/common/http';
import { TReport } from '../../features/feed/model/feed.model';

export interface Stop {
  id: ID;
  name: string;
}

export interface CreateReportPayload {
  user_id: number;
  departure_id: number;
  stop_id: number;
  category: ReportCategory;
  line_id: number;
  delay: number;
}

@Injectable({
  providedIn: 'root',
})
export class ReportFormService {
  private readonly BASE_URL = 'http://127.0.0.1:8000/reports';
  private readonly http = inject(HttpClient);

  saveReport$(payload: CreateReportPayload): Observable<TReport> {
    return this.http.post<TReport>(this.BASE_URL, payload);
  }
}
