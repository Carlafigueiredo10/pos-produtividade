import type { ReactNode } from "react";

export function Cabecalho({ icone, titulo, children }: { icone: ReactNode; titulo: string; children?: ReactNode }) {
  return (
    <div className="cabecalho">
      <div className="icone-pagina">{icone}</div>
      <h1>{titulo}</h1>
      {children && <p className="subtitulo">{children}</p>}
    </div>
  );
}
