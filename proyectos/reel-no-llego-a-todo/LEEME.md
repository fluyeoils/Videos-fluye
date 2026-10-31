# Reel "No llego a todo" (CTA: CONSULTA)

- Video fuente: Google Drive `1E8F7aQPNSVVVj74s7ZWZC4UuBmlpcAX8` (no se sube al repo). Original 1440x2560:
  se bajó a 1080x1920 (`video1080.mp4`) antes de `reel_prep.py` (si no, se queda sin memoria).
- Tramos en `reel.json` (`--gap 0.25 --wide none --cam 1080:1920:0:0`). Después `cam.mp4` se aceleró 1.1x
  (`setpts=PTS/1.1`, `atempo=1.1`) y los tiempos de `words.ts` se dividieron por 1.1.
- Escenas: `src/video.tsx`. Piezas: `src/historia.tsx`. Sonidos extra (tictac, latido, brillo) en `diseno-preview/remotion/public/sfx`.
