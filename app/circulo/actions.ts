"use server";
import { revalidatePath } from "next/cache";
import { addRoomMessage } from "@/lib/simulated";
import { loadCircleRooms } from "@/lib/content";
import { getLang } from "@/lib/i18n/server";

// Stores the message with a random alias. Nobody answers it: no replies are generated (OOS-2).
export async function sendRoomMessage(formData: FormData): Promise<void> {
  const lang = await getLang();
  const slug = String(formData.get("room") ?? "");
  if (!loadCircleRooms(lang).some((r) => r.slug === slug)) return;
  addRoomMessage(slug, String(formData.get("text") ?? ""), lang);
  revalidatePath(`/circulo/${slug}`);
}
