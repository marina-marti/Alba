import AskForm from "./AskForm";

export default async function Page({ searchParams }: { searchParams: Promise<{ desde?: string | string[] }> }) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.desde) ? sp.desde[0] : sp.desde;
  const desde = (raw ?? "").replace(/[^\p{L}\p{N}\s\-_/]/gu, "").trim().slice(0, 60);
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Pregúntale a Alba</h1>
      {desde && <p className="text-sm text-ink/60">desde: {desde}</p>}
      <AskForm page={desde} />
    </div>
  );
}
