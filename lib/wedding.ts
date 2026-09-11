export type WeddingConfig = {
  couple: { a: string; b: string };
  date: string; // ISO with offset
  city: string;
  locale: "en" | "ar";
  hero: { image: string; overlay: string; scrollCue: string };
  intro: { heading: string; body: string };
  gallery: string[];
  events: { title: string; titleAr?: string; type: string; start: string; end: string; mapsUrl: string }[];
  theme: { primary: string; accent: string; bg: string; ink: string; fontLatin: string; fontArabic: string };
  music: { url: string; autoplayOnTap: boolean };
  features: { guestbook: boolean; memories: boolean; rsvp: boolean };
  og: { image: string; description: string };
};

export type Wedding = {
  id: string;
  slug: string;
  config: WeddingConfig;
  published: boolean;
  is_preview: boolean;
};

export type Message = { id: string; guest_name: string; body: string; created_at: string };
export type Memory = { id: string; storage_path: string; guest_name: string | null; created_at: string };

const publicStorageUrl = (path: string) => `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;

/** Config paths are `bucket/dir/file`; resolved against Supabase public storage.
 *  NEXT_PUBLIC_ASSET_BASE (dev) maps `bucket/<wedding_id>/x` -> `${base}/x`. */
export function assetUrl(path: string) {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("/")) return path;
  const base = process.env.NEXT_PUBLIC_ASSET_BASE;
  if (base) return `${base}/${path.split("/").slice(2).join("/")}`;
  return publicStorageUrl(path);
}

/** Always resolves against real Supabase storage, ignoring NEXT_PUBLIC_ASSET_BASE.
 *  Use for assets (e.g. music) that have no local dev placeholder to fall back to. */
export function remoteAssetUrl(path: string) {
  if (/^(https?:)?\/\//.test(path) || path.startsWith("/")) return path;
  return publicStorageUrl(path);
}

/** Calendar parts of the wedding date in the couple's own timezone (the ISO offset). */
export function eventParts(iso: string, locale: string) {
  const d = new Date(iso);
  const m = /([+-])(\d\d):?(\d\d)$/.exec(iso);
  const off = m ? (m[1] === "-" ? -1 : 1) * (+m[2] * 60 + +m[3]) * 60000 : 0;
  const loc = new Date(d.getTime() + off);
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(locale, { timeZone: "UTC", ...o }).format(loc);
  return {
    target: d.getTime(),
    year: f({ year: "numeric" }),
    month: f({ month: "long" }),
    monthShort: f({ month: "short" }),
    day: f({ day: "2-digit" }),
    weekday: f({ weekday: "long" }),
    wdShort: f({ weekday: "short" }),
    time: f({ hour: "numeric", minute: "2-digit" }),
  };
}

/** "18:00" -> "6:00 PM" (or the locale's equivalent). */
export const formatClock = (hhmm: string, locale: string) =>
  new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", timeZone: "UTC" }).format(
    new Date(`1970-01-01T${hhmm}:00Z`),
  );

const STRINGS = {
  en: {
    kicker: "Together with their families",
    countdownTitle: "The Countdown",
    countdown: "Countdown",
    justMarried: "Just married",
    days: "Days", hrs: "Hrs", min: "Min", sec: "Sec",
    saveTheDate: "Save the date",
    openMaps: "Open in Google Maps",
    guestbookTitle: "Leave a message",
    guestbookSub: "Write your wishes for the couple",
    yourName: "Your name",
    yourMessage: "Your message",
    writeFor: "Write a few words for",
    errName: "Add your name so the couple knows who wrote this.",
    errMsg: "Write a message before sending.",
    sending: "Sending…",
    send: "Send message",
    sent: "Message sent",
    memoriesTitle: "Share a memory",
    memoriesSub: "Take a photo tonight and leave it for the couple",
    openCamera: "Open camera",
    takePhoto: "Take photo",
    retake: "Retake",
    upload: "Send photo",
    uploading: "Sending…",
    uploaded: "Photo sent",
    cameraFallback: "Choose or take a photo",
    nameOptional: "Your name (optional)",
    playMusic: "Play music",
    pauseMusic: "Pause music",
    preview: "Preview",
    wedding: "Wedding",
  },
  ar: {
    kicker: "مع عائلتيهما",
    countdownTitle: "العد التنازلي",
    countdown: "العد التنازلي",
    justMarried: "تزوجنا",
    days: "يوم", hrs: "ساعة", min: "دقيقة", sec: "ثانية",
    saveTheDate: "احفظ الموعد",
    openMaps: "افتح في خرائط جوجل",
    guestbookTitle: "اترك رسالة",
    guestbookSub: "اكتب أمنياتك للعروسين",
    yourName: "اسمك",
    yourMessage: "رسالتك",
    writeFor: "اكتب كلمات قليلة لـ",
    errName: "أضف اسمك ليعرف العروسان من كتب هذا.",
    errMsg: "اكتب رسالة قبل الإرسال.",
    sending: "جارٍ الإرسال…",
    send: "أرسل الرسالة",
    sent: "تم إرسال الرسالة",
    memoriesTitle: "شارك ذكرى",
    memoriesSub: "التقط صورة الليلة واتركها للعروسين",
    openCamera: "افتح الكاميرا",
    takePhoto: "التقط صورة",
    retake: "أعد الالتقاط",
    upload: "أرسل الصورة",
    uploading: "جارٍ الإرسال…",
    uploaded: "تم إرسال الصورة",
    cameraFallback: "اختر أو التقط صورة",
    nameOptional: "اسمك (اختياري)",
    playMusic: "تشغيل الموسيقى",
    pauseMusic: "إيقاف الموسيقى",
    preview: "معاينة",
    wedding: "زفاف",
  },
};

export type Strings = (typeof STRINGS)["en"];
export const t = (locale: string): Strings => (locale === "ar" ? STRINGS.ar : STRINGS.en);
