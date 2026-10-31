// Piezas del reel "No llego a todo" (Fluye Oils). Tiempos en segundos del reel.
// Cara grande arriba-centro: títulos cortos arriba (y≈230–520), listas abajo (y≈1180–1440), subtítulos en y≈1520.
import React from "react";
import { AbsoluteFill } from "remotion";
import { C, HAND, TITLE } from "./theme";
import { WORDS } from "./words";
import { pop, prog, useT } from "./lib";

const shadow = "0 3px 14px rgba(94,62,93,.85), 0 1px 3px rgba(94,62,93,.9)";
const fade = (t: number, from: number, to: number) => prog(t, from, 0.3) * (1 - prog(t, to, 0.3));

// ---------- título arriba: palabra fuerte + palabra manuscrita ----------
export const TopTitle: React.FC<{ from: number; to: number; strong: string; hand?: string; handFirst?: boolean; top?: number; size?: number }> = ({
  from, to, strong, hand, handFirst, top = 240, size = 104,
}) => {
  const t = useT();
  if (t < from - 0.05 || t > to + 0.4) return null;
  const o = fade(t, from, to);
  const a = pop(t, from, 0.5);
  const b = pop(t, from + 0.25, 0.5);
  const S = (
    <div key="s" style={{ fontFamily: TITLE, fontWeight: 900, fontSize: size, lineHeight: 0.95, color: C.cream, textShadow: shadow, letterSpacing: -2, transform: `scale(${a})` }}>
      {strong}
    </div>
  );
  const H = hand ? (
    <div key="h" style={{ fontFamily: HAND, fontSize: size * 0.82, lineHeight: 1, color: C.white, textShadow: shadow, transform: `scale(${b}) rotate(-3deg)` }}>
      {hand}
    </div>
  ) : null;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(94,62,93,.55) 0%, rgba(94,62,93,.25) 22%, rgba(94,62,93,0) 34%)" }} />
      <div style={{ position: "absolute", top, left: 50, right: 50, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        {handFirst ? [H, S] : [S, H]}
      </div>
    </AbsoluteFill>
  );
};

// ---------- píldoras que aparecen una a una (zona baja) ----------
export type Pill = { at: number; text: string; icon?: string; strike?: number; hi?: boolean };
export const Pills: React.FC<{ from: number; to: number; items: Pill[]; top?: number; shakeAt?: number; title?: string }> = ({
  from, to, items, top = 1150, shakeAt = 999, title,
}) => {
  const t = useT();
  if (t < from - 0.05 || t > to + 0.4) return null;
  const o = fade(t, from, to);
  const shake = t > shakeAt && t < shakeAt + 0.6 ? Math.sin((t - shakeAt) * 60) * 10 * (1 - (t - shakeAt) / 0.6) : 0;
  return (
    <div style={{ position: "absolute", left: 40, right: 40, top, opacity: o, transform: `translateX(${shake}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {title && (
        <div style={{ fontFamily: HAND, fontSize: 58, color: C.white, textShadow: shadow, transform: `scale(${pop(t, from, 0.4)}) rotate(-2deg)` }}>{title}</div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 14 }}>
        {items.map((it, i) => {
          if (t < it.at) return null;
          const p = pop(t, it.at, 0.4);
          const s = it.strike !== undefined ? prog(t, it.strike, 0.3) : 0;
          return (
            <div
              key={i}
              style={{
                position: "relative",
                padding: "14px 28px 8px",
                borderRadius: 999,
                background: it.hi ? C.cream : "rgba(123,92,129,.82)",
                border: `3px solid ${it.hi ? C.cream : "rgba(255,244,198,.55)"}`,
                color: it.hi ? C.plum : C.white,
                fontFamily: TITLE,
                fontWeight: 800,
                fontSize: 46,
                lineHeight: 1.1,
                transform: `scale(${p})`,
                opacity: 1 - 0.45 * s,
                boxShadow: "0 8px 24px rgba(94,62,93,.35)",
              }}
            >
              {it.icon && <span style={{ marginRight: 10 }}>{it.icon}</span>}
              {it.text}
              {s > 0 && (
                <div style={{ position: "absolute", left: 18, right: 18, top: "52%", height: 6, borderRadius: 3, background: C.cream, transformOrigin: "left", transform: `scaleX(${s}) rotate(-4deg)` }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- tres cosas que se juntan en una ----------
export const Merge: React.FC<{ from: number; to: number; items: { at: number; text: string; icon: string }[]; mergeAt: number; result: string }> = ({
  from, to, items, mergeAt, result,
}) => {
  const t = useT();
  if (t < from - 0.05 || t > to + 0.4) return null;
  const o = fade(t, from, to);
  const m = prog(t, mergeAt, 0.5);
  const r = pop(t, mergeAt + 0.3, 0.55);
  return (
    <div style={{ position: "absolute", left: 30, right: 30, top: 1130, height: 320, opacity: o }}>
      {items.map((it, i) => {
        if (t < it.at) return null;
        const p = pop(t, it.at, 0.4);
        const x0 = (i - 1) * 330;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: "50%",
              top: 30,
              width: 300,
              marginLeft: -150,
              padding: "16px 10px 10px",
              borderRadius: 30,
              background: "rgba(123,92,129,.85)",
              border: `3px solid ${C.cream}`,
              textAlign: "center",
              color: C.white,
              fontFamily: TITLE,
              fontWeight: 800,
              fontSize: 40,
              transform: `translateX(${x0 * (1 - m)}px) scale(${p * (1 - 0.6 * m)})`,
              opacity: 1 - m,
            }}
          >
            <div style={{ fontSize: 58 }}>{it.icon}</div>
            {it.text}
          </div>
        );
      })}
      {t >= mergeAt + 0.3 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 40, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              padding: "22px 50px 12px",
              borderRadius: 40,
              background: C.cream,
              color: C.plum,
              fontFamily: TITLE,
              fontWeight: 900,
              fontSize: 72,
              transform: `scale(${r})`,
              boxShadow: `0 0 60px ${C.cream}88`,
            }}
          >
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

// ---------- burbuja de pregunta de las clientas ----------
export const Bubble: React.FC<{ from: number; to: number; text: string; top?: number }> = ({ from, to, text, top = 1180 }) => {
  const t = useT();
  if (t < from - 0.05 || t > to + 0.4) return null;
  const p = pop(t, from, 0.5);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top, display: "flex", justifyContent: "center", opacity: fade(t, from, to) }}>
      <div style={{ position: "relative", transform: `scale(${p}) rotate(-2deg)` }}>
        <div style={{ padding: "22px 40px 14px", borderRadius: 40, background: C.white, color: C.plum, fontFamily: TITLE, fontWeight: 800, fontSize: 56, boxShadow: "0 12px 34px rgba(94,62,93,.45)" }}>
          {text}
        </div>
        <div style={{ position: "absolute", left: 60, bottom: -22, width: 0, height: 0, borderLeft: "22px solid transparent", borderRight: "22px solid transparent", borderTop: `30px solid ${C.white}` }} />
      </div>
    </div>
  );
};

// ---------- frase destacada con palabra clave en caja crema ----------
export const Quote: React.FC<{ from: number; to: number; a: string; b: string; keyAt: number; top?: number }> = ({ from, to, a, b, keyAt, top = 1140 }) => {
  const t = useT();
  if (t < from - 0.05 || t > to + 0.4) return null;
  const o = fade(t, from, to);
  const k = pop(t, keyAt, 0.55);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(94,62,93,.75) 0%, rgba(94,62,93,.45) 30%, rgba(94,62,93,0) 48%)" }} />
      <div style={{ position: "absolute", left: 40, right: 40, top, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, textAlign: "center" }}>
        <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: 84, color: C.white, textShadow: shadow, transform: `scale(${pop(t, from, 0.45)})` }}>{a}</div>
        {t >= keyAt && (
          <div style={{ padding: "20px 46px 8px", borderRadius: 30, background: C.cream, color: C.plum, fontFamily: TITLE, fontWeight: 900, fontSize: 104, transform: `scale(${k}) rotate(-2deg)`, boxShadow: `0 0 60px ${C.cream}88` }}>
            {b}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- cierre "Comenta CONSULTA 💜" (aparece mientras lo dice) ----------
export const ConsultaCTA: React.FC<{ from: number }> = ({ from }) => {
  const t = useT();
  if (t < from - 0.1) return null;
  const p = prog(t, from, 0.45);
  const k = pop(t, from + 0.5, 0.6);
  const pulse = 1 + 0.03 * Math.sin((t - from) * 6);
  return (
    <AbsoluteFill style={{ opacity: p }}>
      <AbsoluteFill style={{ background: "linear-gradient(0deg, rgba(94,62,93,.92) 0%, rgba(94,62,93,.75) 38%, rgba(94,62,93,0) 62%)" }} />
      <div style={{ position: "absolute", left: 50, right: 50, top: 1060, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, textAlign: "center" }}>
        <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: 96, color: C.white, letterSpacing: -2 }}>Comenta</div>
        <div style={{ padding: "26px 64px 12px", borderRadius: 36, background: C.cream, color: C.plum, fontFamily: TITLE, fontWeight: 900, fontSize: 118, letterSpacing: 2, transform: `scale(${k * pulse})`, boxShadow: `0 0 70px ${C.cream}77` }}>
          CONSULTA 💜
        </div>
        <div style={{ fontFamily: HAND, fontSize: 66, color: C.white, opacity: prog(t, from + 0.9, 0.4), transform: "rotate(-2deg)" }}>y te escribo para conversar</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- subtítulos palabra por palabra, centrados ----------
const clean = (w: string) => w.toLowerCase().replace(/[.,;:¿?¡!“”"]/g, "");
type Chunk = { words: typeof WORDS; s: number; e: number };
const CHUNKS: Chunk[] = (() => {
  const out: Chunk[] = [];
  let cur: typeof WORDS = [];
  WORDS.forEach((w, i) => {
    cur.push(w);
    const next = WORDS[i + 1];
    const end = /[.?!]$/.test(w.w);
    const gap = next ? next.s - w.e > 0.3 : true;
    if (cur.length >= 3 || end || gap || !next) {
      out.push({ words: cur, s: cur[0].s, e: next ? Math.min(next.s, w.e + 0.35) : w.e + 0.5 });
      cur = [];
    }
  });
  return out;
})();
export const Subs: React.FC<{ keywords: string[]; hide: [number, number][]; yAt: (t: number) => number }> = ({ keywords, hide, yAt }) => {
  const t = useT();
  if (hide.some(([a, b]) => t >= a && t <= b)) return null;
  const ch = CHUNKS.find((c) => t >= c.s && t < c.e);
  if (!ch) return null;
  const kw = new Set(keywords.map((k) => k.toLowerCase()));
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top: yAt(t) - 45, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 18px", fontFamily: TITLE, fontWeight: 700, fontSize: 72, lineHeight: 1.1 }}>
      {ch.words.map((w, i) => {
        if (t < w.s) return null;
        const key = kw.has(clean(w.w));
        const p = pop(t, w.s, 0.22);
        return (
          <span key={i} style={{ display: "inline-block", color: key ? C.cream : C.white, textShadow: "0 3px 12px rgba(94,62,93,.9), 0 0 3px rgba(94,62,93,.9)", transform: `scale(${0.7 + 0.3 * p})` }}>
            {w.w.replace(/[.,]$/, "")}
          </span>
        );
      })}
    </div>
  );
};
