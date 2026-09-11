const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");

export default function SaveTheDate({ iso, title, location, label }: { iso: string; title: string; location: string; label: string }) {
  const start = new Date(iso).getTime();
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "BEGIN:VEVENT", `DTSTART:${stamp(start)}`, `DTEND:${stamp(start + 4 * 3600000)}`, `SUMMARY:${title}`, `LOCATION:${location}`, "END:VEVENT", "END:VCALENDAR"].join("\n");
  return (
    <a className="w-pill" href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`} download="wedding.ics">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /></svg>
      {label}
    </a>
  );
}
