// feed-service.ts
import { Injectable } from '@angular/core';
import { TReport } from '../model/feed.model';
import {
  Confidence,
  ID,
  ISODate,
  ReportCategory,
  ReportSource,
} from '../../../core/models/util.model';

@Injectable({ providedIn: 'root' })
export class FeedService {
  // prosta „pamięć” na czas życia aplikacji
  private store = new Map<ID, TReport>();

  getReports(center: [number, number]): TReport[] {
    // 1) przygotuj dane bazowe
    const lipsum = [
      'Krótki opis zdarzenia w okolicy.',
      'Zgłoszenie od użytkownika z aplikacji.',
      'Prośba o weryfikację na miejscu.',
      'Potrzebna interwencja służb miejskich.',
      'Sprawa wymaga monitoringu.',
      'Zgłoszenie powtarzające się cyklicznie.',
      'Dodatkowe zdjęcia w komentarzach.',
      'Zgłoszenie z dużą liczbą plusów.',
      'Wymaga kontaktu z administracją.',
      'Nowe informacje od mieszkańców.',
      'Potencjalne utrudnienia w ruchu.',
      'Zablokowany przejazd wąską ulicą.',
      'Uszkodzona infrastruktura.',
      'Usterka oświetlenia.',
      'Nielegalne składowanie odpadów.',
    ];
    const now = new Date().toISOString() as ISODate;

    const base: TReport[] = Array.from({ length: 15 }, (_, i) => {
      const id = `report-${i}` as ID;
      // jeżeli istnieje w store, zachowaj głosy i (ew.) aktualne location
      const existing = this.store.get(id);

      return {
        id,
        title: `Zgłoszenie #${i + 1}`,
        description: lipsum[i % lipsum.length],
        source:
          i % 3 === 0
            ? ReportSource.USER
            : i % 3 === 1
            ? ReportSource.CARRIER
            : ReportSource.SYSTEM,
        category: i % 2 === 0 ? ReportCategory.VEHICLE_FAILURE : ReportCategory.OTHER,
        confidence: i % 4 === 0 ? Confidence.VERIFIED : Confidence.LOW,
        createdAt: now,
        updatedAt: now,
        location: existing?.location ?? [0, 0], // nadpiszemy niżej
        placeName: `Punkt #${i + 1}`,
        lineId: `line-${Math.floor(i / 3)}` as ID,
        connectionId: i % 2 === 0 ? (`conn-${i}` as ID) : undefined,
        author:
          i % 2 === 0
            ? {
                id: `user-${i}` as ID,
                role: i % 3 === 0 ? 'CARRIER' : i % 3 === 1 ? 'SYSTEM' : 'USER',
                displayName: i % 3 === 1 ? 'System' : `Użytkownik ${i + 1}`,
              }
            : undefined,
        votes: existing?.votes ?? {
          up: Math.floor(Math.random() * 8),
          down: Math.floor(Math.random() * 3),
          my: 0,
        },
      };
    });

    // 2) rozłóż wokół center (logika wyjęta ze state)
    const withGeo = this.attachGeo(base, center);

    // 3) zapisz do store
    withGeo.forEach((r) => this.store.set(r.id, r));
    return withGeo;
  }

  vote(reportId: ID, value: 1 | -1): TReport | undefined {
    const r = this.store.get(reportId);
    if (!r) return undefined;
    r.updatedAt = new Date().toISOString() as ISODate;

    this.store.set(reportId, r);
    return r;
  }

  // TO BE DELETED
  private attachGeo(data: TReport[], center: [number, number]): TReport[] {
    const [lng0, lat0] = center;
    const radiusDeg = 0.06;
    return data.map((r, i) => {
      const angle = (i / data.length) * 2 * Math.PI;
      const jitter = ((i * 37) % 17) / 170;
      const lng = lng0 + Math.cos(angle) * radiusDeg * (0.7 + jitter);
      const lat = lat0 + Math.sin(angle) * radiusDeg * (0.7 + jitter);
      return { ...r, location: [lng, lat] };
    });
  }
}
