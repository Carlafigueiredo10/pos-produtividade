// Ícones de traço simples (24x24), herdam a cor do texto.
type P = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconeBussola = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></svg>
);
export const IconeTimer = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2.5M9.5 2.5h5" /></svg>
);
export const IconeCaixa = (p: P) => (
  <svg {...base} {...p}><path d="M3 13h5l1.5 2.5h5L16 13h5" /><path d="M5 5h14l2 8v6H3v-6z" /></svg>
);
export const IconeBrilho = (p: P) => (
  <svg {...base} {...p}><path d="M12 3l1.8 4.9L19 9.5l-5.2 1.6L12 16l-1.8-4.9L5 9.5l5.2-1.6zM19 16l.7 1.8 1.8.7-1.8.7L19 21l-.7-1.8-1.8-.7 1.8-.7z" /></svg>
);
export const IconeMapa = (p: P) => (
  <svg {...base} {...p}><path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></svg>
);
export const IconeSeta = (p: P) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
