"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-12 items-center justify-center rounded-full bg-dawn-400 px-6 py-3 font-medium text-white shadow-soft hover:bg-dawn-500 active:scale-[0.98]"
    >
      Imprimir / Guardar como PDF
    </button>
  );
}
