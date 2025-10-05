import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, delay } from 'rxjs';

export interface StopDto {
  stop_id: number; // <= WARTOŚĆ option
  stop_code: string; // do wyświetlenia
  stop_name: string; // do wyświetlenia
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocationStopsService {
  private http = inject(HttpClient);
  // podmień na swój endpoint
  private baseUrl = 'http://127.0.0.1:8000/stops?limit=100&offset=0';

  listStops(): Observable<StopDto[]> {
    return this.http.get<StopDto[]>(`${this.baseUrl}`);
  }
}
