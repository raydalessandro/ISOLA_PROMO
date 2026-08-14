import type { Metadata } from "next";

import { ConsoleIsola } from "@/components/gioco/console-isola";

export const metadata: Metadata = {
  title: "Il gioco",
  description:
    "Una piccola avventura sull'isola: commissioni da portare a termine, il memory coi cuccioli, otto stelle da raccogliere. Nessuna battaglia.",
};

/* Il gioco occupa lo schermo: niente testata, niente barra bassa, niente
   scorrimento. La shell si toglie di mezzo da sola su questo percorso. */
export const viewport = {
  themeColor: "#2f6f8b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function Gioco() {
  return <ConsoleIsola />;
}
