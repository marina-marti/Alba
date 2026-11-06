"use server";
import { revalidatePath } from "next/cache";
import { currentWeek, workoutFor } from "@/lib/workouts";

/** Regenerates the routine for her current week, bypassing the cache. */
export async function refreshWorkoutAction(formData: FormData): Promise<void> {
  const lang = formData.get("lang") === "en" ? "en" : "es";
  await workoutFor(currentWeek().week, lang, true);
  revalidatePath("/entrenamiento");
}
