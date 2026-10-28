import { continueRender, delayRender, staticFile } from "remotion";

// Marca Fluye Oils: League Spartan muy gruesa (títulos/subtítulos) y marcador manuscrito para palabras de apoyo.
// Fuentes locales en public/fonts (el navegador del render no puede bajarlas de Google).
export const TITLE = "League Spartan";
export const BODY = TITLE;
export const HAND = "Caveat Brush";
if (typeof document !== "undefined") {
  const h = delayRender("fuentes");
  const faces = [
    new FontFace(TITLE, `url(${staticFile("fonts/ls-latin.woff2")})`, { weight: "100 900" }),
    new FontFace(TITLE, `url(${staticFile("fonts/ls-latinext.woff2")})`, { weight: "100 900", unicodeRange: "U+0100-02AF, U+1E00-1EFF" }),
    new FontFace(HAND, `url(${staticFile("fonts/hand-latin.woff2")})`),
  ];
  Promise.all(faces.map((f) => f.load().then((ff) => (document.fonts as any).add(ff)))).then(() => continueRender(h));
}

// Solo colores de marca (nunca negro). Los nombres lime/violet quedan por compatibilidad con lib.tsx/reel.tsx.
export const C = {
  bg: "#5e3e5d",
  card: "rgba(94,62,93,0.78)",
  cardSolid: "#5e3e5d",
  line: "rgba(255,255,255,0.18)",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.75)",
  lime: "#fff4c6",
  violet: "#7b5c81",
  red: "#fff4c6",
  plum: "#5e3e5d",
  mid: "#7b5c81",
  cream: "#fff4c6",
  white: "#ffffff",
  shadow: "rgba(94,62,93,0.85)",
};

export const MARCA = {
  handle: "@fluyeoils",
  ctaPalabra: "tu bandera",
  ctaTexto: "y te mando las ofertas de tu país",
};
