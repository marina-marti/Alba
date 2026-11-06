// Simple line icons for the Circle rooms (one stroke style, inherits the text color).
const PATHS: Record<string, React.ReactNode> = {
  moon: <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />,
  baby: (<><circle cx="12" cy="12.5" r="8" /><path d="M9 14.5c1.5 1.6 4.5 1.6 6 0" /><path d="M12 4.5c-.3-1.4.8-2.2 2-1.6" /><path d="M9.2 11v.01M14.8 11v.01" strokeWidth="2.2" /></>),
  question: (<><circle cx="12" cy="12" r="9" /><path d="M9.6 9.6a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2.9-1.2 1.8" /><path d="M12 16.8v.01" strokeWidth="2.2" /></>),
  drop: <path d="M12 3c3.6 4.5 6 7.5 6 10.5a6 6 0 0 1-12 0C6 10.5 8.4 7.5 12 3z" />,
  bottle: (<><rect x="8.5" y="9" width="7" height="12" rx="3" /><path d="M10 9V6.5h4V9" /><path d="M11 3.5h2v3h-2z" /><path d="M8.5 14h2.5M8.5 17h2.5" /></>),
  heart: <path d="M12 20s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z" />,
  walk: (<><circle cx="13.5" cy="4.5" r="1.8" /><path d="M13 8l-2 5 3.2 2.6 1 5.4M11 13l-3.2 1.6M13 8l3 3 2.6.6" /></>),
  hand: <path d="M8 12.5V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 10.5V6a1.5 1.5 0 0 1 3 0v8.5c0 3.8-2.6 6-6 6-2.6 0-4.2-1-5.6-3L3.6 14a1.5 1.5 0 0 1 2.5-1.6L8 14.5" />,
};

export default function RoomIcon({ name, className = "h-7 w-7" }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {PATHS[name] ?? PATHS.question}
    </svg>
  );
}
