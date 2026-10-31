// Reel "No llego a todo" — @fluyeoils. Tiempos en segundos del reel (ver words.ts, ya acelerado 1.1x).
import React from "react";
import { AbsoluteFill, Audio, Easing, OffthreadVideo, Sequence, interpolate, staticFile, useVideoConfig } from "remotion";
import { C } from "./theme";
import { useT } from "./lib";
import { Bubble, ConsultaCTA, Merge, Pills, Quote, Subs, TopTitle } from "./historia";

export const CTA_SECONDS = 2.2;
const CTA = 58.8;
const REVEAL = 7.6; // "Eso fue lo que me dijo…"

const KEYWORDS = [
  "todo", "agotada", "masajista", "podología", "quemada", "elegir", "juntarlo", "pasiones", "aceites", "distinto",
  "potenció", "ingreso", "quemados", "talentosos", "aman", "consulta",
];

// zoom: [segundo, zoom, duración de la transición]
const ZOOMS: [number, number, number][] = [
  [0, 1.0, 0], [0.01, 1.12, 6.4], // gancho serio: acercamiento lento
  [6.69, 1.2, 0.2], // "agotada"
  [7.65, 1.0, 0.25], // cambio de tono
  [12.36, 1.06, 0.25], [18.73, 1.14, 0.2], [21.76, 1.0, 0.3], [29.36, 1.07, 0.25], [36.05, 1.0, 0.25],
  [44.45, 1.16, 0.2], // "lo potenció"
  [45.16, 1.04, 0.3], [49.09, 1.0, 0.3], [54.4, 1.1, 0.25], [CTA, 1.0, 0.4],
];
const Cam: React.FC = () => {
  const t = useT();
  let i = 0;
  while (i + 1 < ZOOMS.length && ZOOMS[i + 1][0] <= t) i++;
  const prev = i > 0 ? ZOOMS[i - 1][1] : ZOOMS[0][1];
  const [at, z1, dur] = ZOOMS[i];
  const z = dur === 0 ? z1 : interpolate(t, [at, at + dur], [prev, z1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  // apertura en tono cálido casi blanco y negro (como un recuerdo); vuelve al color en "Eso fue lo que me dijo"
  const mem = 1 - interpolate(t, [REVEAL - 0.2, REVEAL + 0.15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(t, [REVEAL - 0.05, REVEAL + 0.05, REVEAL + 0.3], [0, 0.55, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OffthreadVideo
        src={staticFile("cam.mp4")}
        style={{
          width: 1080,
          height: 1920,
          transform: `scale(${z})`,
          transformOrigin: "50% 32%",
          filter: mem > 0 ? `grayscale(${0.85 * mem}) sepia(${0.45 * mem}) contrast(${1 + 0.08 * mem}) brightness(${1 - 0.04 * mem})` : undefined,
        }}
      />
      {mem > 0 && <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 38%, rgba(255,244,198,${0.1 * mem}) 0%, rgba(94,62,93,${0.45 * mem}) 100%)` }} />}
      {flash > 0 && <AbsoluteFill style={{ background: C.cream, opacity: flash }} />}
    </AbsoluteFill>
  );
};

type S = { at: number; f: string; v?: number; len?: number };
const SFX: S[] = [
  { at: 0, f: "tictac", v: 0.9, len: 6.5 },
  { at: 0.05, f: "boom", v: 0.8 },
  { at: 1.4, f: "pop" }, { at: 2.8, f: "pop" }, { at: 3.1, f: "click", v: 1.5 }, { at: 5.4, f: "pop" }, { at: 5.7, f: "click", v: 1.5 },
  { at: 6.6, f: "latido", v: 1.2 },
  { at: 7.65, f: "whoosh", v: 1.4 }, { at: 8.3, f: "pop" },
  { at: 12.4, f: "whoosh" }, { at: 12.6, f: "pop" }, { at: 13.3, f: "pop" }, { at: 14.3, f: "pop" }, { at: 16.9, f: "pop" }, { at: 17.9, f: "boom", v: 0.7 },
  { at: 18.73, f: "whoosh" },
  { at: 21.76, f: "brillo", v: 1.2 },
  { at: 25.0, f: "pop" }, { at: 25.67, f: "pop" }, { at: 26.3, f: "pop" }, { at: 28.5, f: "brillo", v: 1.3 }, { at: 28.6, f: "ding", v: 1.6 },
  { at: 29.36, f: "whoosh" }, { at: 30.0, f: "pop" }, { at: 31.9, f: "brillo" },
  { at: 34.07, f: "pop", v: 1.4 },
  { at: 36.05, f: "whoosh" }, { at: 36.85, f: "ding", v: 1.2 }, { at: 37.64, f: "ding", v: 1.2 }, { at: 38.9, f: "pop" }, { at: 40.5, f: "pop" },
  { at: 43.07, f: "whoosh" }, { at: 44.45, f: "boom", v: 0.9 },
  { at: 46.2, f: "ding", v: 1.6 },
  { at: 49.09, f: "whoosh" }, { at: 52.1, f: "pop" }, { at: 53.9, f: "pop" }, { at: 54.7, f: "pop" },
  { at: CTA, f: "whoosh" }, { at: 59.3, f: "notif", v: 1 },
];
const Sfx: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      {SFX.map((s, i) => (
        <Sequence key={i} from={Math.round(s.at * fps)} durationInFrames={Math.round((s.len ?? 2.5) * fps)}>
          <Audio src={staticFile(`sfx/${s.f}.wav`)} volume={(s.v ?? 1) * 0.35} />
        </Sequence>
      ))}
    </>
  );
};

// subtítulos: siempre abajo, bajo las tarjetas
const subsY = () => 1545;

export const Main: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg }}>
    <Cam />

    {/* APERTURA */}
    <TopTitle from={0.05} to={6.2} strong="No llego" hand="a todo" size={118} />
    <Pills from={1.3} to={6.2} items={[
      { at: 1.4, icon: "🚗", text: "buscar a mi hija" },
      { at: 2.8, icon: "💆‍♀️", text: "consulta", strike: 3.1 },
      { at: 5.4, icon: "📚", text: "estudiar", strike: 5.7 },
    ]} />
    <Pills from={6.6} to={7.5} items={[{ at: 6.6, icon: "🪫", text: "agotada", hi: true }]} />

    {/* REVELACIÓN */}
    <TopTitle from={8.3} to={12.2} hand="…me dijo" strong="una masajista" handFirst size={92} />

    {/* CONFLICTO */}
    <Pills from={12.4} to={21.6} shakeAt={18.73} items={[
      { at: 12.6, icon: "👧", text: "hijos" },
      { at: 13.3, icon: "🏃‍♀️", text: "corre-corre" },
      { at: 14.3, icon: "💆‍♀️", text: "masajes de vez en cuando" },
      { at: 16.9, icon: "📚", text: "estudios" },
      { at: 17.9, icon: "🔥", text: "quemada", hi: true },
    ]} />
    <TopTitle from={18.73} to={21.6} strong="todo" hand="dependía de ella" size={100} />

    {/* DESCUBRIMIENTO */}
    <TopTitle from={23.7} to={28.4} strong="no tenía que" hand="elegir" size={92} />
    <Merge from={24.9} to={29.2} mergeAt={28.5} result="juntarlo todo ✨" items={[
      { at: 25.0, icon: "💆‍♀️", text: "masajes" },
      { at: 25.67, icon: "🦶", text: "podología" },
      { at: 26.3, icon: "🩺", text: "su consulta" },
    ]} />

    {/* CAMBIO */}
    <Pills from={29.9} to={33.8} items={[
      { at: 30.0, icon: "🌿", text: "aceites en su consulta" },
      { at: 31.9, icon: "✨", text: "su espacio olía distinto", hi: true },
    ]} />
    <Bubble from={34.07} to={35.9} text="¿qué estás usando? 👀" />

    {/* RESULTADO */}
    <TopTitle from={36.05} to={42.9} strong="hoy" size={110} />
    <Pills from={36.6} to={42.9} items={[
      { at: 36.85, icon: "✓", text: "masajes" },
      { at: 37.64, icon: "✓", text: "podología" },
      { at: 38.9, icon: "🛍️", text: "se llevan productos a casa" },
      { at: 40.5, icon: "💜", text: "compran sin que ella esté", hi: true },
    ]} />
    <Quote from={43.07} to={45.1} a="No reemplazó nada:" b="lo potenció" keyAt={44.45} />
    <Pills from={46.1} to={48.9} items={[{ at: 46.2, icon: "💸", text: "un ingreso que no depende solo de ella", hi: true }]} />

    {/* PUENTE */}
    <TopTitle from={50.4} to={58.4} strong="profesionales" hand="del bienestar" size={92} />
    <Pills from={52.0} to={58.4} items={[
      { at: 52.1, icon: "✓", text: "talentosas" },
      { at: 53.9, icon: "✓", text: "clientas que las aman" },
      { at: 54.7, icon: "🔥", text: "pero quemadas", hi: true },
    ]} />

    <Subs keywords={KEYWORDS} hide={[[43.0, 45.2], [CTA, 999]]} yAt={subsY} />
    <ConsultaCTA from={CTA} />
    <Sfx />
  </AbsoluteFill>
);
