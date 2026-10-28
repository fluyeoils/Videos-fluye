// VISTA PREVIA DE DISEÑO (sin el video real): fondo de muestra en lugar de la cámara.
import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig } from "remotion";
import { C } from "./theme";
import { DURATION } from "./words";
import { BonusCountries, Confetti, FlagCTA, IntroTitle, Oil, OilReveal, RankTable, SubsRank } from "./ranking";

export const CTA_SECONDS = 4;

const OILS: Oil[] = [
  { id: "terrashield", name: "TerraShield", slot: 6, color: "#7aa94e", at: 3.2, land: 6.0 },
  { id: "calmer", name: "Calmer", slot: 3, color: "#6a4bb0", at: 7.0, land: 9.8 },
  { id: "jengibre", name: "Jengibre", slot: 8, color: "#c79a5a", at: 11, land: 13.5 },
  { id: "hierbabuena", name: "Hierbabuena", slot: 5, color: "#5fc2b5", at: 14.5, land: 17 },
  { id: "albahaca", name: "Albahaca", slot: 9, color: "#8bb35a", at: 18, land: 20.5 },
  { id: "lavender-peace", name: "Lavender Peace Stick", slot: 2, color: "#c58fe0", at: 21.5, land: 24 },
  { id: "supermint", name: "SuperMint Beadlets", slot: 7, color: "#3fb39b", at: 25, land: 27.5 },
  { id: "frankincense", name: "Frankincense Stick", slot: 4, color: "#e07a35", at: 28.5, land: 31 },
  { id: "lavanda-touch", name: "Lavanda Touch", slot: 1, color: "#a776c9", at: 33.2, land: 35 },
];
const WIN = 35 + 0.55;

type S = { at: number; f: string; v?: number };
const SFX: S[] = [
  { at: 0, f: "drumroll", v: 1 }, { at: 0.15, f: "pop" },
  ...OILS.flatMap((o) => [{ at: o.at, f: "whoosh", v: 1.4 }, { at: o.land + 0.5, f: "ding", v: 1.6 }]),
  { at: 32.0, f: "redoble", v: 1 },
  { at: WIN, f: "victoria", v: 1 }, { at: WIN + 0.3, f: "aplausos", v: 1 },
  { at: 40, f: "whoosh" }, { at: 41, f: "whoosh" }, { at: 42.4, f: "whoosh" }, { at: 43.8, f: "whoosh" },
  { at: DURATION, f: "notif", v: 1 },
];
const Sfx: React.FC = () => {
  const { fps } = useVideoConfig();
  return <>{SFX.map((s, i) => (
    <Sequence key={i} from={Math.round(s.at * fps)} durationInFrames={fps * 3}>
      <Audio src={staticFile(`sfx/${s.f}.wav`)} volume={(s.v ?? 1) * 0.35} />
    </Sequence>
  ))}</>;
};

const Placeholder = () => (
  <AbsoluteFill style={{ background: "linear-gradient(170deg,#b9a3b6 0%,#8d7390 55%,#6d5370 100%)" }}>
    <div style={{ position: "absolute", left: 360, top: 330, width: 420, height: 560, borderRadius: "48%", background: "rgba(255,244,198,.35)" }} />
    <div style={{ position: "absolute", left: 230, top: 860, width: 700, height: 1100, borderRadius: "45% 45% 0 0", background: "rgba(255,244,198,.25)" }} />
  </AbsoluteFill>
);

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Placeholder />
    <RankTable oils={OILS} from={0.3} dimFrom={39.5} dimTo={DURATION - 0.3} winnerAt={WIN} />
    {OILS.map((o) => <OilReveal key={o.id} oil={o} />)}
    <IntroTitle to={3.0} />
    <Confetti at={WIN} />
    <BonusCountries from={39.5} to={DURATION - 0.2} list={[
      { flag: "🇨🇴", country: "Colombia", name: "Malama", at: 40 },
      { flag: "🇬🇹", country: "Guatemala", name: "Madagascar Vanilla", at: 41 },
      { flag: "🇨🇷", country: "Costa Rica", name: "Deep Blue cápsulas", at: 42.4 },
      { flag: "🇲🇽", country: "México", name: "MetaPWR", img: "metapwr", at: 43.8 },
    ]} />
    <SubsRank keywords={["calmer", "tres"]} hide={[[DURATION, 999]]} />
    <FlagCTA from={DURATION} />
    <Sfx />
  </AbsoluteFill>
);
