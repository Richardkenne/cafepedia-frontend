export interface Cafe {
  id: number;
  name: string;
  area?: string;
  neighborhood?: string;
  address?: string;
  lat?: number;
  lng?: number;
  rating?: number;
  rating_count?: number;
  reviews?: number;
  price_level?: string;
  price_range?: string;
  type?: string;
  environment?: string;
  tags?: string[];
  phone?: string;
  website?: string;
  instagram?: string;
  hours?: string;
  google_maps_link?: string;
  description?: string;
  hero_photo?: string;
  photos?: string[];
  distance_km?: number;
  reason?: string;
}

export interface SearchResponse {
  found: number;
  results: Cafe[];
}

export interface DecideResponse {
  top3: Cafe[];
  more: Cafe[];
}
