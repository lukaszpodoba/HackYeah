export interface ReportDTO {
  id: string;
  title?: string;
  description?: string;
  source: 'CARRIER' | 'USER' | 'SYSTEM';
  category: 'ROADWORKS' | 'VEHICLE_FAILURE' | 'ACCIDENT' | 'OTHER';
  confidence: 'LOW' | 'MEDIUM' | 'HIGH' | 'VERIFIED';
  createdAt: string;
  updatedAt?: string;
  location: { lat: number; lon: number };
  placeName?: string;
  lineId?: string;
  connectionId?: string;
  media?: { url: string; type: 'image' | 'video' }[];
  author?: { id: string; role: 'USER' | 'CARRIER' | 'SYSTEM'; displayName?: string };
}
