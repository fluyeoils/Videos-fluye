// Reel "blind ranking" Flash Sale dōTERRA Chile — @fluyeoils. Tiempos en segundos del reel (ver words.ts).
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useVideoConfig, Easing } from "remotion";
import { C } from "./theme";
import { DURATION } from "./words";
import { useT } from "./lib";
import { BonusCountries, Confetti, FlagCTA, IntroTitle, Oil, OilReveal, RankTable, SubsRank } from "./ranking";

export const CTA_SECONDS = 1.6; // el cierre empieza mientras habla ("Comenta con una banderita…")

const OILS: Oil[] = [
  { id: "terrashield", name: "TerraShield", slot: 6, color: "#7aa94e", at: 2.7, land: 6.64 },
  { id: "calmer", name: "Calmer", slot: 3, color: "#6a4bb0", at: 7.36, land: 10.6 },
  { id: "jengibre", name: "Jengibre", slot: 8, color: "#c79a5a", at: 11.2, land: 14.42 },
  { id: "hierbabuena", name: "Hierbabuena", slot: 5, color: "#5fc2b5", at: 15.06, land: 20.96 },
  { id: "albahaca", name: "Albahaca", slot: 9, color: "#8bb35a", at: 21.98, land: 24.94 },
  { id: "lavender-peace", name: "Lavender Peace Stick", slot: 2, color: "#c58fe0", at: 25.6, land: 30.86 },
  { id: "supermint", name: "SuperMint Beadlets", slot: 7, color: "#3fb39b", at: 31.36, land: 34.34 },
  { id: "frankincense", name: "Frankincense Stick", slot: 4, color: "#e07a35", at: 35.1, land: 40.56 },
  { id: "lavanda-touch", name: "Lavanda Touch", slot: 1, color: "#a776c9", at: 42.94, land: 43.85 },
];
const WIN = 43.85 + 0.55; // la Lavanda Touch aterriza en el #1
const BONUS = 46.36; // "Si no estás en Chile…"
const CTA = 56.7; // "Comenta con una banderita…"

const KEYWORDS = [
  "6.", "3.", "8.", "5.", "9", "2.", "7,", "4.", "1",
  "calmer", "jengibre", "hierbabuena", "albahaca", "lavender", "peace", "super", "mint", "stick", "incienso",
  "lavanda", "touch", "medalla", "colombia", "malama", "guatemala", "vainilla", "costa", "rica", "deep", "blue", "méxico", "metapwr", "chile",
].map((k) => k.replace(/[.,]$/, ""));

// zoom suave que cambia en cada aceite (disimula los cortes); origen en la cara
const ZOOMS: [number, number][] = [
  [0, 1.0], [2.66, 1.12], [7.36, 1.0], [11.2, 1.14], [15.06, 1.04], [21.98, 1.14], [25.44, 1.02], [31.36, 1.14],
  [35.04, 1.04], [41.02, 1.2], [WIN, 1.06], [BONUS, 1.12], [CTA, 1.0],
];
const Cam: React.FC = () => {
  const t = useT();
  let i = 0;
  while (i + 1 < ZOOMS.length && ZOOMS[i + 1][0] <= t) i++;
  const prev = i > 0 ? ZOOMS[i - 1][1] : ZOOMS[0][1];
  // el redoble del #1 empuja lento; el resto entra en un golpe corto
  const dur = ZOOMS[i][0] === 41.02 ? 1.8 : 0.25;
  const z = interpolate(t, [ZOOMS[i][0], ZOOMS[i][0] + dur], [prev, ZOOMS[i][1]], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo src={staticFile("cam.mp4")} style={{ width: 1080, height: 1920, transform: `scale(${z})`, transformOrigin: "50% 22%" }} />
    </AbsoluteFill>
  );
};

type S = { at: number; f: string; v?: number; len?: number };
const SFX: S[] = [
  { at: 0, f: "drumroll", v: 0.9, len: 2.7 },
  { at: 0.15, f: "pop" },
  ...OILS.slice(0, 8).flatMap((o) => [{ at: o.at, f: "whoosh", v: 1.6 }, { at: o.land + 0.45, f: "ding", v: 2 }]),
  { at: 40.95, f: "drumroll", v: 0.8, len: 2.0 }, // redoble antes de revelar el #1
  { at: 42.94, f: "whoosh", v: 1.6 },
  { at: WIN - 0.1, f: "victoria", v: 0.9 },
  { at: WIN + 0.25, f: "aplausos", v: 0.8 },
  { at: BONUS, f: "whoosh" },
  { at: 48.26, f: "whoosh", v: 1.4 }, { at: 49.54, f: "whoosh", v: 1.4 }, { at: 51.02, f: "whoosh", v: 1.4 }, { at: 54.32, f: "whoosh", v: 1.4 },
  { at: CTA, f: "notif", v: 0.9 },
];
const Sfx: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * fps)} durationInFrames={Math.round((s.len ?? 3) * fps)}>
          <Audio src={staticFile(`sfx/${s.f}.wav`)} volume={(s.v ?? 1) * 0.35} />
        </Sequence>
      ))}
    </>
  );
};

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Cam />
    <RankTable oils={OILS} from={0.3} dimFrom={BONUS} dimTo={999} winnerAt={WIN} />
    {OILS.map((o) => <OilReveal key={o.id} oil={o} />)}
    <IntroTitle to={2.55} />
    <Confetti at={WIN} />
    <BonusCountries
      from={BONUS}
      to={CTA - 0.1}
      list={[
        { flag: "🇨🇴", country: "Colombia", name: "Malama", at: 48.26 },
        { flag: "🇬🇹", country: "Guatemala", name: "Madagascar Vanilla", at: 49.54 },
        { flag: "🇨🇷", country: "Costa Rica", name: "Deep Blue cápsulas", at: 51.02 },
        { flag: "🇲🇽", country: "México", name: "MetaPWR", img: "metapwr", at: 54.32 },
      ]}
    />
    <SubsRank keywords={KEYWORDS} hide={[[0, 2.6], [CTA, 999]]} />
    <FlagCTA from={CTA} />
    <Sfx />
  </AbsoluteFill>
);
