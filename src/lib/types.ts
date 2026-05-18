export type VenueType = 'БАР' | 'ОТЕЛЬ' | 'РЕСТОРАН';

export interface Venue {
  id: string;
  slug: string;
  type: VenueType;
  name: string;
  address: string;
  lat: number;
  lng: number;
  cover: string;
  blurb: string;
  story_ids: string[];
}

export interface Story {
  id: string;
  venue_id: string;
  title: string;
  duration_sec: number;
  audio_url: string;
  is_free: boolean;
  price_rub: number;
  text: string;
}

export interface NearbyVenue extends Venue {
  distance_m: number;
}
