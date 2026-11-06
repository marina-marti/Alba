// Demo clinic map (REQ-58). Pure and dependency-free so node:test can load it.
// Everything here is simulated (OOS-2): the clinics are invented and no location is ever read.
export type Clinic = {
  id: string;
  name: string;
  type: string;
  distance_km: number;
  hours: string;
  phone: string; // fictional, +1 555 010x
  x: number; // 0..100 on the map
  y: number;
  simulated: true;
};
export type Point = { x: number; y: number };

/** Where "you" start on the map, and where the simulated location moves her. */
export const YOU_START: Point = { x: 50, y: 60 };
export const YOU_EXAMPLE: Point = { x: 44, y: 54 };

const MAP_W = 4; // map is 4:3, so one x percent is 4 units and one y percent is 3
const MAP_H = 3;
const KM_PER_UNIT = 1 / 70;

/** Fictional distance in km from a map point, one decimal. */
export function distanceKm(from: Point, to: Point): number {
  const dx = (to.x - from.x) * MAP_W;
  const dy = (to.y - from.y) * MAP_H;
  return Math.round(Math.hypot(dx, dy) * KM_PER_UNIT * 10) / 10;
}

/** Nearest first. Stable: equal distances keep their incoming order. */
export function rankByDistance<T extends { distance_km: number }>(items: readonly T[]): T[] {
  return items
    .map((item, i) => ({ item, i }))
    .sort((a, b) => a.item.distance_km - b.item.distance_km || a.i - b.i)
    .map((e) => e.item);
}

/** The simulated "use my location": same clinics, new distances from the example spot, re-ranked. */
export function simulateLocation(clinics: readonly Clinic[], you: Point = YOU_EXAMPLE): Clinic[] {
  return rankByDistance(clinics.map((c) => ({ ...c, distance_km: distanceKm(you, c) })));
}

/** Only the fictional range +1 555 0100..0199 is allowed. */
export function isFictionalPhone(p: string): boolean {
  return /^\+1 555 01\d\d$/.test(p);
}
export const telHref = (p: string) => `tel:${p.replace(/[^\d+]/g, "")}`;
