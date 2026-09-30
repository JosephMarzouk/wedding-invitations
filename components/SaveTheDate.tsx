export default function SaveTheDate({ iso, title, location, label }: { iso: string; title: string; location: string; label: string }) {
  return (
    <a className="w-pill" href={`/api/calendar?${new URLSearchParams({ start: iso, title, location })}`} target="_blank" rel="noopener noreferrer">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
      {label}
    </a>
  );
}
