import "server-only";
import fs from "node:fs";
import path from "node:path";
import { getDb } from "@/lib/db";

// SIMULATED (OOS-2): all demo content below is read from content/demo/*.json; nothing is sent or moderated for real.

export function readDemo<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "demo", file), "utf8")) as T;
}

export type CirclePost = {
  id: string; type: string; time?: string; anonymous?: boolean; alias?: string; author?: string;
  text?: string; transcript?: string; duration?: string; reply_to?: string;
};
export type Tip = { id: string; topic: string; title: string; text: string };
export type TimelineEvent = { day: number; channel: string; text: string };
export type ChecklistItem = { id: string; label: string; done: boolean };

let ready = false;
function db() {
  const d = getDb();
  if (!ready) {
    d.exec(`
      CREATE TABLE IF NOT EXISTS sim_circle_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT, alias TEXT, text TEXT, created_at TEXT
      );
      CREATE TABLE IF NOT EXISTS sim_checklist (item_id TEXT PRIMARY KEY, done INTEGER DEFAULT 0, updated_at TEXT);
      CREATE TABLE IF NOT EXISTS sim_confirmations (kind TEXT PRIMARY KEY, confirmed_at TEXT);
    `);
    ready = true;
  }
  return d;
}

// Random alias generator (REQ-17, AC-28). The author is intentionally not stored.
const A = ["Luna", "Sol", "Brisa", "Alba", "Río", "Nube", "Flor", "Estrella", "Lluvia", "Colibrí"];
const B = ["cálida", "serena", "valiente", "tranquila", "de Mayo", "del Valle", "de Abril", "suave", "luminosa", "del Mar"];
export function randomAlias(): string {
  return `${A[Math.floor(Math.random() * A.length)]} ${B[Math.floor(Math.random() * B.length)]}`;
}

export type UserPost = { id: number; kind: string; alias: string; text: string; created_at: string };
export function listUserPosts(): UserPost[] {
  return db().prepare("SELECT * FROM sim_circle_posts ORDER BY id DESC").all() as UserPost[];
}
export function addUserPost(kind: "question" | "quick_win", text: string): void {
  const t = text.trim().slice(0, 500);
  if (!t) return;
  db().prepare("INSERT INTO sim_circle_posts (kind, alias, text, created_at) VALUES (?,?,?,?)")
    .run(kind, randomAlias(), t, new Date().toISOString());
}

export function checklistState(): Record<string, boolean> {
  const rows = db().prepare("SELECT item_id, done FROM sim_checklist").all() as { item_id: string; done: number }[];
  return Object.fromEntries(rows.map((r) => [r.item_id, !!r.done]));
}
export function setChecklist(id: string, done: boolean): void {
  const valid = readDemo<{ items: ChecklistItem[] }>("checklist.es.json").items.some((i) => i.id === id);
  if (!valid) return;
  db().prepare(
    "INSERT INTO sim_checklist (item_id, done, updated_at) VALUES (?,?,?) ON CONFLICT(item_id) DO UPDATE SET done=excluded.done, updated_at=excluded.updated_at"
  ).run(id, done ? 1 : 0, new Date().toISOString());
}

export type ConfirmKind = "clinic_call" | "visit_attended";
export function confirmations(): Record<string, string> {
  const rows = db().prepare("SELECT kind, confirmed_at FROM sim_confirmations").all() as { kind: string; confirmed_at: string }[];
  return Object.fromEntries(rows.map((r) => [r.kind, r.confirmed_at]));
}
export function confirm(kind: string): void {
  if (kind !== "clinic_call" && kind !== "visit_attended") return;
  db().prepare("INSERT OR IGNORE INTO sim_confirmations (kind, confirmed_at) VALUES (?,?)").run(kind, new Date().toISOString());
}
