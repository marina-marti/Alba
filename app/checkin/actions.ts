"use server";
import { redirect } from "next/navigation";
import { addCheckin, listCheckins, type Checkin } from "@/lib/db";
import { escalationFor } from "@/lib/escalation";

export type SavedCheckin = Omit<Checkin, "created_at"> & { note: string | null };

function scale(v: FormDataEntryValue | null): number {
  const n = Number(v);
  if (!Number.isInteger(n) || n < 1 || n > 5) throw new Error("Respuesta fuera de la escala 1-5");
  return n;
}

function today(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Saves the check-in and returns the saved values (T-004 wires red-flag escalation on this result). */
export async function saveCheckinAction(formData: FormData): Promise<SavedCheckin> {
  const note = String(formData.get("note") ?? "").trim().slice(0, 2000);
  const input = {
    day: today(),
    bleeding: scale(formData.get("bleeding")),
    pain: scale(formData.get("pain")),
    mood: scale(formData.get("mood")),
    healing: scale(formData.get("healing")),
    pad_soak: formData.get("pad_soak") === "1" ? 1 : 0,
    note: note || null,
  };
  const id = addCheckin(input);
  return { id, ...input };
}

/** Form action: save, then go to the urgent screen if a red flag fires, else the confirmation page. */
export async function submitCheckin(formData: FormData): Promise<void> {
  const saved = await saveCheckinAction(formData);
  const history = listCheckins().filter((c) => c.id !== saved.id);
  const esc = escalationFor(saved, history);
  if (esc === "pad") redirect("/alerta");
  if (esc === "mood") redirect("/alerta?motivo=animo");
  if (esc === "selfharm") redirect("/alerta?motivo=selfharm");
  redirect("/checkin/gracias");
}
