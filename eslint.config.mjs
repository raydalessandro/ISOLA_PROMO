import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Il motore del gioco è portato quasi alla lettera dal prototipo di Ray:
    // si tiene com'è. Il contratto verso l'app è tipizzato in motore.d.ts.
    "lib/gioco/motore.js",
  ]),
]);
