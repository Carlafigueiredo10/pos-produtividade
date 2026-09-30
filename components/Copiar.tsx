"use client";

import { useState } from "react";

export function Copiar({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);
  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {}
  }
  return (
    <div className="linha-botoes">
      <button className="botao" onClick={copiar}>{copiado ? "Copiado ✓" : "Copiar prompt com os dados"}</button>
      <a className="botao secundario" href="https://claude.ai/new" target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
        Abrir o Claude
      </a>
    </div>
  );
}
