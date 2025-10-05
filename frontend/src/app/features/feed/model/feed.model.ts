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
  user_id: ID;
  departure_id: ID;

  report_time: ISODate;
  as_form: number;
  confirmed_by_admin: boolean;
  like_total: number;
  dislike_total: number;
  stop_id: number;
  category: ReportCategory;
  line_id: number;
  delay: number;
  is_email_sent: false;
  stop: {
    id: number;
    stop_code: number;
    stop_name: string;
    latitude: number;
    longitude: number;
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
