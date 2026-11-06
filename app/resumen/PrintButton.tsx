"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn"
    >
      Imprimir / Guardar como PDF
    </button>
  );
}
