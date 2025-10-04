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
