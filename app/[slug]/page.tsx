import type { CSSProperties } from "react";
import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { assetUrl, eventParts, remoteAssetUrl, t, type Memory, type Message, type Wedding } from "@/lib/wedding";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Gallery from "@/components/Gallery";
import Countdown from "@/components/Countdown";
import SaveTheDate from "@/components/SaveTheDate";
import Events from "@/components/Events";
import Guestbook from "@/components/Guestbook";
import Memories from "@/components/Memories";
import Music from "@/components/Music";
import Reveal from "@/components/Reveal";
import ClosingNote from "@/components/ClosingNote";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string | string[] }>;
};

const getWedding = cache(async (slug: string, preview: string | null) => {
  const { data } = await supabase.rpc("get_wedding", { p_slug: slug, p_preview: preview });
  return (data as Wedding | null) ?? null;
});

async function load(props: Props) {
  const [{ slug }, { preview }] = await Promise.all([props.params, props.searchParams]);
  return getWedding(slug, typeof preview === "string" ? preview : null);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const w = await load(props);
  if (!w) return {};
  const { couple, og } = w.config;
  const title = `${couple.a} & ${couple.b}`;
  return {
    title,
    description: og.description,
    openGraph: { title, description: og.description, images: [assetUrl(og.image)] },
    robots: w.is_preview ? { index: false, follow: false } : undefined,
  };
}

const fontParam = (name: string) => name.trim().replace(/\s+/g, "+");

export default async function Page(props: Props) {
  const w = await load(props);
  if (!w) notFound();
  const c = w.config;
  const s = t(c.locale);
  const rtl = c.locale === "ar";
  const ev = eventParts(c.date, c.locale);
  const dateLine = `${ev.day} · ${ev.monthShort} · ${ev.year}`;
  const coupleLine = `${c.couple.a} & ${c.couple.b}`;

  const [messages, memories] = await Promise.all([
    c.features.guestbook
      ? supabase.from("messages").select("id,guest_name,body,created_at").eq("wedding_id", w.id).eq("approved", true).order("created_at", { ascending: false }).limit(50)
      : null,
    c.features.memories
      ? supabase.from("memories").select("id,storage_path,guest_name,created_at").eq("wedding_id", w.id).eq("approved", true).order("created_at", { ascending: false }).limit(60)
      : null,
  ]);

  const fontsHref =
    `https://fonts.googleapis.com/css2?family=Pinyon+Script` +
    `&family=${fontParam(c.theme.fontLatin)}:ital,wght@0,400;0,500;0,600;1,400` +
    `&family=${fontParam(c.theme.fontArabic)}:wght@400;700&display=swap`;

  const theme = {
    "--bg": c.theme.bg,
    "--ink": c.theme.ink,
    "--primary": c.theme.primary,
    "--accent": c.theme.accent,
    "--font-latin": `"${c.theme.fontLatin}"`,
    "--font-arabic": `"${c.theme.fontArabic}"`,
  } as CSSProperties;

  return (
    <div className="wedding" dir={rtl ? "rtl" : "ltr"} lang={c.locale} style={theme}>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href={fontsHref} precedence="fonts" />

      {w.is_preview && (
        <div style={{ position: "fixed", top: 12, insetInlineStart: 12, zIndex: 60, padding: "6px 14px", borderRadius: 999, background: "var(--primary)", color: "var(--on-primary)", fontSize: 12, letterSpacing: ".2em", textTransform: "uppercase" }}>
          {s.preview}
        </div>
      )}

      <Hero
        a={c.couple.a} b={c.couple.b} dateLine={dateLine} kicker={s.kicker}
        image={assetUrl(c.hero.image)} overlay={assetUrl(c.hero.overlay)} scrollCue={c.hero.scrollCue} rtl={rtl}
      />
      <Reveal>
        <Intro heading={c.intro.heading} body={c.intro.body} />
      </Reveal>
      <Reveal>
        <Gallery photos={c.gallery.map(assetUrl)} alt={coupleLine} />
      </Reveal>
      <Reveal>
        <Countdown iso={c.date} locale={c.locale} strings={s}>
          <SaveTheDate iso={c.date} title={`${coupleLine} — ${s.wedding}`} location={c.city} label={s.saveTheDate} />
        </Countdown>
      </Reveal>
      <Reveal>
        <Events events={c.events} locale={c.locale} city={c.city} images={c.gallery.length ? c.gallery.map(assetUrl) : [assetUrl(c.hero.image)]} strings={s} />
      </Reveal>
      {c.features.guestbook && (
        <Reveal>
          <Guestbook weddingId={w.id} coupleLine={coupleLine} bg={assetUrl(c.gallery.at(-1) ?? c.hero.image)} initial={(messages?.data ?? []) as Message[]} strings={s} />
        </Reveal>
      )}
      {c.features.memories && (
        <Reveal>
          <Memories weddingId={w.id} coupleLine={coupleLine} dateLine={dateLine} initial={(memories?.data ?? []) as Memory[]} strings={s} />
        </Reveal>
      )}
      <Reveal>
        <ClosingNote text={s.waitingForYou} />
      </Reveal>
      {c.music?.url && <Music src={remoteAssetUrl(c.music.url)} autoplayOnTap={c.music.autoplayOnTap} playLabel={s.playMusic} pauseLabel={s.pauseMusic} rtl={rtl} />}
    </div>
  );
}
