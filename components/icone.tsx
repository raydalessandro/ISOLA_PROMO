/*
 * Icone della barra bassa. Tratto disegnato, non riempito: stanno accanto a
 * un'illustrazione ad acquerello e non devono sembrare pittogrammi di sistema.
 * Sono decorative — l'etichetta di testo sotto ciascuna porta il significato.
 */

type Props = { className?: string };

const comuni = {
  "aria-hidden": true,
  fill: "none",
  focusable: false,
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.6,
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
} as const;

export function IconaIsola({ className }: Props) {
  return (
    <svg {...comuni} className={className}>
      <path d="M3 17.5c2.2-1.2 3.4-1.2 5.6 0s3.4 1.2 5.6 0 3.4-1.2 5.6 0" />
      <path d="M4.8 13.8c1.6-3.6 4-5.4 7.2-5.4s5.6 1.8 7.2 5.4z" />
      <path d="M12 8.4V4.6" />
      <path d="M12 4.6c1.5 0 2.4.5 2.7 1.4-.3.9-1.2 1.4-2.7 1.4z" />
    </svg>
  );
}

export function IconaMondo({ className }: Props) {
  return (
    <svg {...comuni} className={className}>
      <circle cx="8.5" cy="8" r="3.1" />
      <circle cx="16.4" cy="10.4" r="2.4" />
      <path d="M3 19.4c0-3 2.5-4.9 5.5-4.9s5.5 1.9 5.5 4.9" />
      <path d="M15.4 15.1c2.8-.4 5.6 1 5.6 4.3" />
    </svg>
  );
}

export function IconaStorie({ className }: Props) {
  return (
    <svg {...comuni} className={className}>
      <path d="M12 6.6C10.6 5.4 8.9 4.8 6.8 4.8H3.6v13.1h3.2c2.1 0 3.8.6 5.2 1.8" />
      <path d="M12 6.6c1.4-1.2 3.1-1.8 5.2-1.8h3.2v13.1h-3.2c-2.1 0-3.8.6-5.2 1.8z" />
      <path d="M12 6.6v13.1" />
    </svg>
  );
}

export function IconaLibro({ className }: Props) {
  return (
    <svg {...comuni} className={className}>
      <path d="M6.2 3.4h11.1a1.5 1.5 0 0 1 1.5 1.5v14.2a1.5 1.5 0 0 1-1.5 1.5H6.2A1.7 1.7 0 0 1 4.5 19V5.1a1.7 1.7 0 0 1 1.7-1.7z" />
      <path d="M4.5 17.1h14.3" />
      <path d="M8.4 7.4h6.3" />
    </svg>
  );
}

export function IconaGioco({ className }: Props) {
  return (
    <svg {...comuni} className={className}>
      <rect height="10.4" rx="3.2" width="18" x="3" y="6.8" />
      <path d="M7.1 10.4v3.2M5.5 12h3.2" />
      <circle cx="15.6" cy="11.3" r="0.9" />
      <circle cx="18" cy="13.4" r="0.9" />
    </svg>
  );
}

export function IconaMappa({ className }: Props) {
  return (
    <svg {...comuni} className={className}>
      <path d="M9.2 4.6 3.6 6.8v12.6l5.6-2.2 5.6 2.2 5.6-2.2V4.6l-5.6 2.2z" />
      <path d="M9.2 4.6v12.6M14.8 6.8v12.6" />
    </svg>
  );
}
