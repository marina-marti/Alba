"use server";
import { revalidatePath } from "next/cache";
import { addUserPost } from "@/lib/simulated";
import { getLang } from "@/lib/i18n/server";

export async function publish(formData: FormData): Promise<void> {
  const kind = formData.get("kind") === "quick_win" ? "quick_win" : "question";
  addUserPost(kind, String(formData.get("text") ?? ""), await getLang());
  revalidatePath("/circulo");
}
