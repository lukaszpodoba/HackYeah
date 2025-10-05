export type ID = string;
export type ISODate = string;

export interface Coords {
  lat: number;
  lon: number;
}

export enum Role {
  USER = 'USER',
  CARRIER = 'CARRIER',
} // przewoźnik
export enum ReportSource {
  CARRIER = 'CARRIER',
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}

export enum ReportCategory {
  ROADWORKS = 'ROADWORKS',
  VEHICLE_FAILURE = 'VEHICLE_FAILURE',
  ACCIDENT = 'ACCIDENT',
  OTHER = 'OTHER',
}

export enum Confidence {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  VERIFIED = 'VERIFIED',
}

export const markerClassByType: Record<ReportCategory, string> = {
  ROADWORKS: 'marker--incident',
  VEHICLE_FAILURE: 'marker--delay',
  ACCIDENT: 'marker--maintenance',
  OTHER: 'marker--info',
};
