import venuesJson from '@/../data/venues.json';
import storiesJson from '@/../data/stories.json';
import type { Venue, Story, NearbyVenue } from './types';
import { haversineMeters } from './haversine';

const venues = venuesJson.venues as Venue[];
const stories = storiesJson.stories as Story[];

export function getAllVenues(): Venue[] {
  return venues;
}

export function getVenueBySlug(slug: string): Venue | undefined {
  return venues.find((v) => v.slug === slug);
}

export function getVenueById(id: string): Venue | undefined {
  return venues.find((v) => v.id === id);
}

export function getStoriesByVenue(venueId: string): Story[] {
  return stories.filter((s) => s.venue_id === venueId);
}

export function getStoryById(id: string): Story | undefined {
  return stories.find((s) => s.id === id);
}

export function getNearbyVenues(venueId: string, count = 3): NearbyVenue[] {
  const origin = getVenueById(venueId);
  if (!origin) return [];
  return venues
    .filter((v) => v.id !== venueId)
    .map((v) => ({
      ...v,
      distance_m: Math.round(haversineMeters(origin.lat, origin.lng, v.lat, v.lng)),
    }))
    .sort((a, b) => a.distance_m - b.distance_m)
    .slice(0, count);
}

export function getVenueStats() {
  return {
    venues_count: venues.length,
    stories_count: stories.length,
    total_duration_sec: stories.reduce((sum, s) => sum + s.duration_sec, 0),
  };
}
