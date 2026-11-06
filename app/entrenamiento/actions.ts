"use server";
import { revalidatePath } from "next/cache";
import { currentWeek, workoutFor } from "@/lib/workouts";
import { toggleExercise } from "@/lib/db";
import { isoLocal } from "@/lib/calendar";

/** Regenerates the routine for her current week, bypassing the cache. */
export async function refreshWorkoutAction(formData: FormData): Promise<void> {
  const lang = formData.get("lang") === "en" ? "en" : "es";
  await workoutFor(currentWeek().week, lang, true);
  revalidatePath("/entrenamiento");
}

/** "Done today" button: records (or removes) today's exercise for the dashboard calendar. */
export async function toggleExerciseTodayAction(): Promise<void> {
  toggleExercise(isoLocal(new Date()), currentWeek().week);
  revalidatePath("/entrenamiento");
  revalidatePath("/");
}
