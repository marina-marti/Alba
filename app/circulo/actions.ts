"use server";
import { revalidatePath } from "next/cache";
import { addUserPost } from "@/lib/simulated";

export async function publish(formData: FormData): Promise<void> {
  const kind = formData.get("kind") === "quick_win" ? "quick_win" : "question";
  addUserPost(kind, String(formData.get("text") ?? ""));
  revalidatePath("/circulo");
}
