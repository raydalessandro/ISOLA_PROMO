import type { MetadataRoute } from "next";

import { sito } from "@/lib/canone";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: sito.nome,
    short_name: sito.nomeBreve,
    description: sito.descrizione,
    start_url: "/",
    display: "standalone",
    background_color: sito.coloreTema,
    theme_color: sito.coloreTema,
    lang: "it",
    orientation: "portrait",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Il gioco", short_name: "Gioco", url: "/gioco" },
      { name: "Le storie", short_name: "Storie", url: "/storie" },
    ],
  };
}
