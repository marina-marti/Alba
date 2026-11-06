"use server";
import { revalidatePath } from "next/cache";
import { setChecklist, confirm } from "@/lib/simulated";

export async function toggleItem(formData: FormData): Promise<void> {
  setChecklist(String(formData.get("id")), formData.get("done") === "1");
  revalidatePath("/visita");
}
export async function confirmAction(formData: FormData): Promise<void> {
  confirm(String(formData.get("kind")));
  revalidatePath("/visita");
}
