import {
  ID,
  ReportSource,
  ReportCategory,
  Confidence,
  ISODate,
  Coords,
} from '../../../core/models/util.model';

export interface Report {
  id: ID;
  title?: string;
  description?: string;
  source: ReportSource; // typ markera/zgłoszenia
  category: ReportCategory;
  confidence: Confidence; // np. VERIFIED dla przewoźnika
  createdAt: ISODate;
  updatedAt?: ISODate;
  location: Coords;
  placeName?: string; // np. nazwa przystanku / punkt POI
  lineId?: ID; // ID linii (opcjonalnie)
  connectionId?: ID; // ID konkretnego połączenia/relacji (opcjonalnie)
  media?: { url: string; type: 'image' | 'video' }[];
  author?: { id: ID; role: 'USER' | 'CARRIER' | 'SYSTEM'; displayName?: string };
}

export interface ReportFilter {
  bbox?: [number, number, number, number];
  categories?: ReportCategory[];
  sources?: ReportSource[];
  minConfidence?: Confidence;
  lineIds?: ID[];
  connectionIds?: ID[];
}
