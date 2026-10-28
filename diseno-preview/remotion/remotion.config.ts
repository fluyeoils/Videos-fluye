import { Config } from "@remotion/cli/config";
// Chromium ya instalado en este entorno (evita descargar Chrome Headless Shell de internet).
Config.setBrowserExecutable("/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell");
