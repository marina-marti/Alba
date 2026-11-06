// Circle rooms storage (REQ-56, OOS-2 simulated). No server-only import, so node:test can load it.
// The database is passed in, so tests can use an in-memory SQLite.
export type RoomDb = {
  exec(sql: string): unknown;
  prepare(sql: string): { run(...a: unknown[]): unknown; all(...a: unknown[]): unknown[] };
};

export type RoomMessageRow = { id: number; room: string; alias: string; text: string; created_at: string };

export const ROOM_TEXT_MAX = 500;

export function ensureRoomTable(db: RoomDb): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sim_room_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT, room TEXT, alias TEXT, text TEXT, created_at TEXT
    );
  `);
}

/** Stores one message. Returns false when the text is empty after trimming. */
export function insertRoomMessage(db: RoomDb, room: string, alias: string, text: string, now = new Date()): boolean {
  const t = text.trim().slice(0, ROOM_TEXT_MAX);
  if (!t) return false;
  db.prepare("INSERT INTO sim_room_messages (room, alias, text, created_at) VALUES (?,?,?,?)").run(room, alias, t, now.toISOString());
  return true;
}

export function selectRoomMessages(db: RoomDb, room: string): RoomMessageRow[] {
  return db.prepare("SELECT id, room, alias, text, created_at FROM sim_room_messages WHERE room = ? ORDER BY id ASC").all(room) as RoomMessageRow[];
}

/** The newest stored message of every room, keyed by room. */
export function selectLatestByRoom(db: RoomDb): Record<string, RoomMessageRow> {
  const rows = db.prepare(
    "SELECT id, room, alias, text, created_at FROM sim_room_messages WHERE id IN (SELECT MAX(id) FROM sim_room_messages GROUP BY room)"
  ).all() as RoomMessageRow[];
  return Object.fromEntries(rows.map((r) => [r.room, r]));
}

/** Whole minutes since an ISO time (never negative). */
export function minutesSince(iso: string, now = new Date()): number {
  return Math.max(0, Math.floor((now.getTime() - new Date(iso).getTime()) / 60000));
}

/** Which dictionary key and number to use for "hace 2 h". */
export function agoParts(minutes: number): { key: "room.now" | "room.ago.min" | "room.ago.h" | "room.ago.d"; n: number } {
  if (minutes < 1) return { key: "room.now", n: 0 };
  if (minutes < 60) return { key: "room.ago.min", n: minutes };
  if (minutes < 1440) return { key: "room.ago.h", n: Math.round(minutes / 60) };
  return { key: "room.ago.d", n: Math.round(minutes / 1440) };
}
