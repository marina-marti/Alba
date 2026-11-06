import { getProfile, listCheckins } from "@/lib/db";
import { buildSummary, type SummaryResult } from "@/lib/summary";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

const printCss = `
@page { size: A4; margin: 12mm; }
@media print {
  header, nav { display: none !important; }
  body { background: #fff !important; }
  body > div { max-width: none !important; min-height: 0 !important; display: block !important; }
  main { padding: 0 !important; }
  .no-print { display: none !important; }
  #resumen { font-size: 10pt; line-height: 1.25; color: #000; }
  #resumen h1 { font-size: 16pt; }
  #resumen table { width: 100%; border-collapse: collapse; page-break-inside: avoid; break-inside: avoid; }
  #resumen th, #resumen td { padding: 2pt 4pt; border-bottom: 0.5pt solid #999; }
  #resumen tr { page-break-inside: avoid; break-inside: avoid; }
  #resumen { page-break-after: avoid; break-after: avoid; }
}`;

const fmt = (iso: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso + (iso.length === 10 ? "T12:00:00" : ""));
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("es", { day: "numeric", month: "long", year: "numeric" });
};

export default async function Page() {
  const profile = getProfile();
  let summary: SummaryResult | null = null;
  let failed = false;
  try {
    summary = await buildSummary(listCheckins(), profile);
  } catch {
    failed = true; // AC-81: error message, no table
  }

  return (
    <div id="resumen">
      <style dangerouslySetInnerHTML={{ __html: printCss }} />
      <h1 className="page-title print:font-sans print:font-semibold print:tracking-normal">Resumen para tu cita</h1>
      <p className="mt-2 text-base text-ink-soft print:text-sm print:text-black">
        Parto: {fmt(profile?.delivery_date ?? null)} · Cita: {fmt(profile?.appointment_date ?? null)}
      </p>

      {failed ? (
        <p role="alert" className="mt-6 rounded-3xl bg-dawn-100 p-5">
          No pudimos preparar tu resumen. Inténtalo de nuevo en un momento.
        </p>
      ) : summary && summary.rows.length === 0 ? (
        <p className="mt-4 rounded-3xl bg-dawn-100 p-5">
          Todavía no hay registros. Cuando hagas tu primer registro de hoy, aquí verás tu resumen para llevar a tu cita.
        </p>
      ) : summary ? (
        <>
          {summary.narrative && <p className="mt-6 text-base print:mt-3 print:text-sm">{summary.narrative}</p>}
          <div className="mt-6 overflow-x-auto rounded-3xl bg-white/70 p-3 shadow-soft print:rounded-none print:bg-transparent print:p-0 print:shadow-none">
            <table className="w-full text-left text-sm print:text-xs [&_td]:px-2 [&_td]:py-2 [&_th]:px-2 [&_th]:py-2">
              <thead>
                <tr className="border-b border-dawn-300">
                  <th>Día</th>
                  <th>Sangrado</th>
                  <th>Dolor</th>
                  <th>Ánimo</th>
                  <th>Cicatrización</th>
                  <th>Toalla empapada</th>
                  <th>Nota</th>
                </tr>
              </thead>
              <tbody>
                {summary.rows.map((r, i) => (
                  <tr key={i} className="border-b border-dawn-100 align-top">
                    <td className="whitespace-nowrap">{r.day}</td>
                    <td>{r.bleeding}</td>
                    <td>{r.pain}</td>
                    <td>{r.mood}</td>
                    <td>{r.healing}</td>
                    <td>{r.padSoak ? "Sí" : "No"}</td>
                    <td>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-ink-soft print:mt-2 print:text-xs print:text-black">Escalas de 1 a 5. Este resumen no es un diagnóstico.</p>
        </>
      ) : null}

      <div className="no-print mt-8">
        <PrintButton />
      </div>
    </div>
  );
}
