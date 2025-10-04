import {
  ID,
  ReportSource,
  ReportCategory,
  Confidence,
  ISODate,
  Coords,
} from '../../../core/models/util.model';

// TODO to be changed when dto
export type TReport = {
  id: ID;
  title: string;
  description?: string;
  source: ReportSource;
  category: ReportCategory;
  confidence: Confidence;
  createdAt: ISODate;
  updatedAt: ISODate;
  location: [number, number];
  placeName: string;
  lineId: ID;
  connectionId?: ID;
  author?: { id: ID; role: 'USER' | 'CARRIER' | 'SYSTEM'; displayName?: string };

  votes?: {
    up: number;
    down: number;
    my?: 1 | -1 | 0;
  };
};

export interface ReportFilter {
  bbox?: [number, number, number, number];
  categories?: ReportCategory[];
  sources?: ReportSource[];
  minConfidence?: Confidence;
  lineIds?: ID[];
  connectionIds?: ID[];
}
