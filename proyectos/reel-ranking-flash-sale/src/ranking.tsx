// Piezas del formato "blind ranking" (Fluye Oils). Tiempos en segundos del reel.
import React from "react";
import { AbsoluteFill, Img, interpolate, random, staticFile } from "remotion";
import { C, HAND, TITLE } from "./theme";
import { WORDS } from "./words";
import { pop, prog, useT } from "./lib";

export type Oil = {
  id: string; // archivo en public/productos/<id>.png
  name: string;
  slot: number; // puesto 1..9
  color: string; // color de la etiqueta del aceite (destello de la casilla)
  at: number; // cuando lo nombra → aparece al centro
  land: number; // cuando dice el número → vuela a la casilla
};

// ---------- tabla ----------
export const TABLE = { x: 24, top: 236, w: 300, slotH: 138, gap: 8 };
const slotY = (n: number) => TABLE.top + (n - 1) * (TABLE.slotH + TABLE.gap);
const THUMB_H = 112;
// centro de la miniatura dentro de la casilla
const thumbC = (n: number) => ({ x: TABLE.x + 112, y: slotY(n) + TABLE.slotH / 2 });

// zona del producto grande (a la derecha de la tabla, sin tapar la cara: se ajusta por video)
export const PROD = { cx: 870, cy: 940, h: 470, labelX: 690 };
const FLY = 0.55;

const shadowTxt = "0 3px 14px rgba(94,62,93,.85), 0 1px 3px rgba(94,62,93,.9)";

export const RankTable: React.FC<{ oils: Oil[]; from?: number; dimFrom?: number; dimTo?: number; winnerAt?: number }> = ({
  oils,
  from = 0,
  dimFrom = 999,
  dimTo = 999,
  winnerAt = 999,
}) => {
  const t = useT();
  const dim = prog(t, dimFrom, 0.4) * (1 - prog(t, dimTo, 0.4));
  return (
    <AbsoluteFill style={{ opacity: 1 - 0.65 * dim }}>
      {Array.from({ length: 9 }, (_, i) => {
        const n = i + 1;
        const y = slotY(n);
        const inP = pop(t, from + i * 0.07, 0.45);
        const oil = oils.find((o) => o.slot === n);
        const filled = oil && t >= oil.land + FLY;
        const flash = oil ? prog(t, oil.land + FLY - 0.08, 0.12) * (1 - prog(t, oil.land + FLY + 0.15, 0.6)) : 0;
        const gold = n === 1;
        const win = gold ? prog(t, winnerAt, 0.4) : 0;
        const border = gold ? C.cream : C.mid;
        return (
          <div
            key={n}
            style={{
              position: "absolute",
              left: TABLE.x,
              top: y,
              width: TABLE.w,
              height: TABLE.slotH,
              borderRadius: 28,
              border: `5px solid ${flash > 0.02 ? oil!.color : border}`,
              background: flash > 0.02 ? `${oil!.color}${Math.round(40 + 120 * flash).toString(16).padStart(2, "0")}` : "rgba(94,62,93,.42)",
              boxShadow: [
                gold ? `0 0 ${18 + 30 * win}px ${C.cream}${win > 0 ? "cc" : "88"}` : "0 6px 20px rgba(94,62,93,.35)",
                flash > 0.02 ? `0 0 ${50 * flash}px ${oil!.color}` : "",
              ].filter(Boolean).join(","),
              transform: `translateX(${(1 - inP) * -340}px) scale(${1 + 0.06 * flash})`,
              display: "flex",
              alignItems: "center",
              overflow: "visible",
            }}
          >
            <div
              style={{
                width: 66,
                textAlign: "center",
                fontFamily: TITLE,
                fontWeight: 900,
                fontSize: 70,
                lineHeight: 1,
                paddingTop: 10,
                color: gold ? C.cream : C.white,
                textShadow: shadowTxt,
              }}
            >
              {n}
            </div>
            {filled && (
              <>
                <Img src={staticFile(`productos/${oil!.id}.png`)} style={{ height: THUMB_H, width: 90, objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(94,62,93,.6))" }} />
                <div
                  style={{
                    flex: 1,
                    padding: "0 10px 0 6px",
                    fontFamily: TITLE,
                    fontWeight: 800,
                    fontSize: oil!.name.length > 13 ? 25 : 29,
                    lineHeight: 1.02,
                    color: C.white,
                    textShadow: shadowTxt,
                  }}
                >
                  {oil!.name}
                  {gold && t >= winnerAt && <span style={{ display: "inline-block", transform: `scale(${pop(t, winnerAt + 0.2, 0.5)})`, marginLeft: 6 }}>🏆</span>}
                </div>
              </>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- producto que salta al centro y vuela a su casilla ----------
export const OilReveal: React.FC<{ oil: Oil }> = ({ oil }) => {
  const t = useT();
  if (t < oil.at - 0.05 || t > oil.land + FLY + 0.05) return null;
  const inP = pop(t, oil.at, 0.55);
  const fly = prog(t, oil.land, FLY);
  const float = Math.sin((t - oil.at) * 3) * 8 * (1 - fly);
  const target = thumbC(oil.slot);
  const cx = interpolate(fly, [0, 1], [PROD.cx, target.x]);
  const cy = interpolate(fly, [0, 1], [PROD.cy, target.y]) + float;
  const s = interpolate(fly, [0, 1], [1, THUMB_H / PROD.h]) * inP;
  const labelO = Math.min(1, prog(t, oil.at + 0.15, 0.3)) * (1 - prog(t, oil.land, 0.15));
  return (
    <AbsoluteFill>
      {/* halo suave detrás del producto */}
      <div
        style={{
          position: "absolute",
          left: PROD.cx - 280,
          top: PROD.cy - 280,
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${C.cream}aa 0%, ${C.cream}33 45%, transparent 70%)`,
          opacity: inP * (1 - fly),
          transform: `scale(${0.6 + 0.4 * inP})`,
        }}
      />
      <Img
        src={staticFile(`productos/${oil.id}.png`)}
        style={{
          position: "absolute",
          height: PROD.h,
          left: cx,
          top: cy,
          transform: `translate(-50%,-50%) scale(${s}) rotate(${(1 - inP) * -12 + fly * -8}deg)`,
          filter: "drop-shadow(0 18px 30px rgba(94,62,93,.55))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: PROD.labelX - 360,
          width: 720,
          top: PROD.cy + PROD.h / 2 + 30,
          display: "flex",
          justifyContent: "center",
          opacity: labelO,
          transform: `translateY(${(1 - labelO) * 20}px)`,
        }}
      >
        <div
          style={{
            background: C.plum,
            color: C.white,
            fontFamily: TITLE,
            fontWeight: 800,
            fontSize: oil.name.length > 14 ? 46 : 54,
            padding: "14px 38px 8px",
            borderRadius: 999,
            border: `3px solid ${C.cream}`,
            boxShadow: "0 10px 30px rgba(94,62,93,.5)",
          }}
        >
          {oil.name}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- intro ----------
export const IntroTitle: React.FC<{ to: number }> = ({ to }) => {
  const t = useT();
  if (t > to + 0.5) return null;
  const a = pop(t, 0.15, 0.5);
  const b = pop(t, 0.55, 0.5);
  const c = prog(t, 1.0, 0.4);
  const out = 1 - prog(t, to, 0.35);
  return (
    <div
      style={{
        position: "absolute",
        left: TABLE.x + TABLE.w + 20,
        right: 30,
        top: 1080,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        opacity: out,
        transform: `translateY(${(1 - out) * 40}px)`,
      }}
    >
      <div
        style={{
          fontFamily: TITLE,
          fontWeight: 900,
          fontSize: 112,
          lineHeight: 0.95,
          color: C.cream,
          textShadow: shadowTxt,
          transform: `scale(${a})`,
          letterSpacing: -2,
        }}
      >
        RANKEANDO
      </div>
      <div style={{ fontFamily: HAND, fontSize: 96, color: C.white, textShadow: shadowTxt, transform: `scale(${b}) rotate(-3deg)`, marginTop: 4 }}>
        las ofertas 🔥
      </div>
      <div
        style={{
          marginTop: 22,
          padding: "14px 26px 8px",
          borderRadius: 22,
          background: "rgba(123,92,129,.78)",
          fontFamily: TITLE,
          fontWeight: 700,
          fontSize: 36,
          lineHeight: 1.15,
          color: C.white,
          opacity: c,
          transform: `translateY(${(1 - c) * 20}px)`,
        }}
      >
        Flash Sale dōTERRA · ¿cuál queda en el <span style={{ color: C.cream, fontWeight: 900 }}>#1</span>?
      </div>
    </div>
  );
};

// ---------- confeti del #1 ----------
const CONF_COLORS = [C.cream, C.mid, C.white, "#c9a7d6", C.cream];
export const Confetti: React.FC<{ at: number; dur?: number }> = ({ at, dur = 3.2 }) => {
  const t = useT();
  const dt = t - at;
  if (dt < 0 || dt > dur) return null;
  return (
    <AbsoluteFill style={{ opacity: 1 - prog(t, at + dur - 0.6, 0.6) }}>
      {Array.from({ length: 110 }, (_, i) => {
        const r = (k: string) => random(`c${i}${k}`);
        const x0 = 540 + (r("x") - 0.5) * 300;
        const vx = (r("vx") - 0.5) * 1500;
        const vy = -1300 - r("vy") * 1100;
        const g = 1900;
        const x = x0 + vx * dt * 0.8 + Math.sin(dt * 6 + i) * 30;
        const y = 1500 + vy * dt + 0.5 * g * dt * dt;
        const w = 14 + r("w") * 14;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: w,
              height: w * (r("s") > 0.5 ? 0.45 : 1),
              borderRadius: r("s") > 0.75 ? "50%" : 3,
              background: CONF_COLORS[i % CONF_COLORS.length],
              transform: `rotate(${dt * 600 * (r("r") - 0.5)}deg)`,
              boxShadow: "0 1px 3px rgba(94,62,93,.4)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- bonus por país ----------
export type Bonus = { flag: string; country: string; name: string; img?: string; at: number };
export const BonusCountries: React.FC<{ from: number; to: number; list: Bonus[] }> = ({ from, to, list }) => {
  const t = useT();
  if (t < from - 0.1 || t > to + 0.4) return null;
  const o = prog(t, from, 0.3) * (1 - prog(t, to, 0.3));
  const cur = [...list].reverse().find((b) => t >= b.at);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div
        style={{
          position: "absolute",
          left: TABLE.x + TABLE.w + 20,
          right: 30,
          top: 300,
          textAlign: "center",
          fontFamily: TITLE,
          fontWeight: 900,
          fontSize: 68,
          lineHeight: 1,
          color: C.white,
          textShadow: shadowTxt,
          transform: `scale(${pop(t, from, 0.5)})`,
        }}
      >
        ¿No estás en <span style={{ color: C.cream }}>Chile</span>? 👀
      </div>
      {cur && (
        <div
          key={cur.name}
          style={{
            position: "absolute",
            left: TABLE.x + TABLE.w + 40,
            right: 50,
            top: 1060,
            display: "flex",
            alignItems: "center",
            gap: 22,
            padding: "22px 28px 16px",
            borderRadius: 34,
            background: "rgba(255,244,198,.9)",
            boxShadow: "0 14px 40px rgba(94,62,93,.45)",
            transform: `translateX(${(1 - prog(t, cur.at, 0.35)) * 700}px)`,
          }}
        >
          <div style={{ fontSize: 96, lineHeight: 1 }}>{cur.flag}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: HAND, fontSize: 40, color: C.mid }}>{cur.country}</div>
            <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: cur.name.length > 16 ? 44 : 52, lineHeight: 1, color: C.plum }}>{cur.name}</div>
          </div>
          {cur.img && <Img src={staticFile(`productos/${cur.img}.png`)} style={{ height: 290, margin: "-110px 0 -40px", filter: "drop-shadow(0 8px 14px rgba(94,62,93,.45))" }} />}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- cierre ----------
export const FlagCTA: React.FC<{ from: number }> = ({ from }) => {
  const t = useT();
  if (t < from - 0.1) return null;
  const p = prog(t, from, 0.45);
  const k = pop(t, from + 0.25, 0.55);
  const pulse = 1 + 0.03 * Math.sin((t - from) * 6);
  return (
    <AbsoluteFill style={{ opacity: p }}>
      <AbsoluteFill style={{ background: "rgba(94,62,93,.86)" }} />
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 60,
          right: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          textAlign: "center",
          transform: `translateY(${(1 - p) * 40}px)`,
        }}
      >
        <div style={{ fontFamily: TITLE, fontWeight: 900, fontSize: 104, lineHeight: 1, color: C.white, letterSpacing: -2 }}>Comenta</div>
        <div
          style={{
            padding: "24px 60px 12px",
            borderRadius: 36,
            background: C.cream,
            color: C.plum,
            fontFamily: TITLE,
            fontWeight: 900,
            fontSize: 112,
            lineHeight: 1,
            transform: `scale(${k * pulse})`,
            boxShadow: `0 0 70px ${C.cream}66`,
          }}
        >
          tu bandera
        </div>
        <div style={{ fontSize: 92, letterSpacing: 10, transform: `scale(${pop(t, from + 0.55, 0.5)})` }}>🇨🇱🇨🇴🇬🇹🇨🇷🇲🇽</div>
        <div style={{ fontFamily: HAND, fontSize: 76, lineHeight: 1.15, color: C.white, opacity: prog(t, from + 0.8, 0.4), transform: "rotate(-2deg)" }}>
          y te mando las ofertas de tu país
        </div>
        <div
          style={{
            marginTop: 30,
            padding: "18px 40px 10px",
            borderRadius: 999,
            background: C.mid,
            border: `3px solid ${C.cream}`,
            fontFamily: TITLE,
            fontWeight: 800,
            fontSize: 50,
            color: C.white,
            opacity: prog(t, from + 1.1, 0.4),
            transform: `scale(${pop(t, from + 1.1, 0.5)})`,
          }}
        >
          Solo hasta el <span style={{ color: C.cream }}>sábado 31</span> ⏳
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- subtítulos palabra por palabra ----------
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
    if (cur.length >= 3 || end || (gap && cur.length >= 1) || !next) {
      out.push({ words: cur, s: cur[0].s, e: next ? Math.min(next.s, w.e + 0.35) : w.e + 0.5 });
      cur = [];
    }
  });
  return out;
})();

/** Blancos con sombra suave, a la derecha de la tabla, centro-abajo. Palabra clave en crema. */
export const SubsRank: React.FC<{ keywords: string[]; hide: [number, number][]; y?: number }> = ({ keywords, hide, y = 1450 }) => {
  const t = useT();
  if (hide.some(([a, b]) => t >= a && t <= b)) return null;
  const ch = CHUNKS.find((c) => t >= c.s && t < c.e);
  if (!ch) return null;
  const kw = new Set(keywords.map((k) => k.toLowerCase()));
  return (
    <div
      style={{
        position: "absolute",
        left: TABLE.x + TABLE.w + 16,
        right: 24,
        top: y - 50,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 16px",
        fontFamily: TITLE,
        fontWeight: 700,
        fontSize: 70,
        lineHeight: 1.1,
        textAlign: "center",
      }}
    >
      {ch.words.map((w, i) => {
        if (t < w.s) return null;
        const key = kw.has(clean(w.w));
        const p = pop(t, w.s, 0.22);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              color: key ? C.cream : C.white,
              textShadow: "0 3px 12px rgba(94,62,93,.9), 0 0 3px rgba(94,62,93,.9)",
              transform: `scale(${0.7 + 0.3 * p})`,
            }}
          >
            {w.w.replace(/[.,]$/, "")}
          </span>
        );
      })}
    </div>
  );
};
