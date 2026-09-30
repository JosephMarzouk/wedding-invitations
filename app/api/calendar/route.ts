const stamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
// RFC 5545 text escaping; also keeps a crafted title from injecting extra calendar lines.
const esc = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\r?\n/g, "\\n");

/** Save-the-date: Apple devices get an .ics served inline, which Safari hands straight to the
 *  "Add to Calendar" sheet; everyone else is sent to Google Calendar's prefilled event page, which
 *  Android opens in the Calendar app. A data: URI download did neither on phones. */
export function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const start = Date.parse(q.get("start") ?? "");
  if (Number.isNaN(start)) return new Response("Bad start", { status: 400 });
  const title = (q.get("title") ?? "Wedding").slice(0, 200);
  const location = (q.get("location") ?? "").slice(0, 300);
  const dates = [stamp(start), stamp(start + 4 * 3600000)];

  if (/iPhone|iPad|iPod|Macintosh/.test(req.headers.get("user-agent") ?? "")) {
    const ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//wedding-invitations//EN", "BEGIN:VEVENT",
      `UID:${dates[0]}-${encodeURIComponent(title)}@wedding-invitations`, `DTSTAMP:${stamp(Date.now())}`,
      `DTSTART:${dates[0]}`, `DTEND:${dates[1]}`, `SUMMARY:${esc(title)}`, `LOCATION:${esc(location)}`,
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    return new Response(ics, { headers: { "Content-Type": "text/calendar; charset=utf-8", "Content-Disposition": 'inline; filename="wedding.ics"' } });
  }

  const g = new URLSearchParams({ action: "TEMPLATE", text: title, dates: dates.join("/"), location });
  return Response.redirect(`https://calendar.google.com/calendar/render?${g}`, 302);
}
