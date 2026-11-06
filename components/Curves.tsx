// Quiet decorative curves. Inline SVG, aria-hidden, colored by currentColor.
export function Sunrise({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 48 30" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M8 26a16 16 0 0 1 32 0" />
      <path d="M2 26h44" />
      <path d="M24 3v3M8 10l2 2M40 10l-2 2" />
    </svg>
  );
}

export function Blob({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 200" className={className} fill="currentColor">
      <path d="M44 -58c14 -9 33 -12 46 -4s20 25 22 41c3 16 -1 33 -10 46s-24 21 -40 25c-16 4 -33 3 -45 -6S-4 53 -8 38s-6 -31 2 -44c8 -14 22 -20 36 -34z" transform="translate(70 100) scale(1.35)" />
    </svg>
  );
}

export function Wave({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 400 24" preserveAspectRatio="none" className={className} fill="none">
      <defs>
        <linearGradient id="wave-fade" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#f1c39d" stopOpacity="0" />
          <stop offset="0.5" stopColor="#f1c39d" />
          <stop offset="1" stopColor="#f1c39d" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 14C60 2 100 2 160 12s120 12 180 0c25-5 45-5 60-2" stroke="url(#wave-fade)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
