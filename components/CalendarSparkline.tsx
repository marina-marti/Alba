import type { StripDay } from "@/lib/calendar";

/** Tiny bar sparkline of her own 1-5 numbers. Pure SVG; the text alternative lists the numbers. */
export default function CalendarSparkline({
  label,
  days,
  field,
  alt,
  color,
}: {
  label: string;
  days: StripDay[];
  field: "mood" | "pain";
  alt: string;
  color: string;
}) {
  const w = 10;
  const gap = 4;
  const h = 40;
  const width = days.length * (w + gap) - gap;
  return (
    <figure className="m-0">
      <figcaption className="mb-1 text-sm text-ink-soft">{label}</figcaption>
      <svg role="img" aria-label={alt} viewBox={`0 0 ${width} ${h}`} className="h-10 w-full" preserveAspectRatio="none">
        {days.map((d, i) => {
          const v = d[field];
          const x = i * (w + gap);
          if (v === null) return <circle key={d.date} cx={x + w / 2} cy={h - 2} r={1.6} fill="currentColor" className="text-ink-soft/40" />;
          const bh = 6 + ((v - 1) / 4) * (h - 8);
          return <rect key={d.date} x={x} y={h - bh} width={w} height={bh} rx={3} fill={color} />;
        })}
      </svg>
    </figure>
  );
}
