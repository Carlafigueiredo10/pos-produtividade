"use client";

import { useState } from "react";
import { CampoPin, usePin } from "./Pin";
import { CONTEXTOS, ORIGENS } from "@/lib/tipos";

export function Captura({ demo }: { demo: boolean }) {
  const [pin, setPin] = usePin();
  const [texto, setTexto] = useState("");
  const [origem, setOrigem] = useState("");
  const [contexto, setContexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [msg, setMsg] = useState<{ texto: string; tipo: "ok" | "erro" } | null>(null);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setMsg(null);
    const r = await fetch("/api/capturar", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-pos-pin": pin },
      body: JSON.stringify({ texto, origem, contexto }),
    });
    const j = await r.json().catch(() => ({}));
    setEnviando(false);
    if (!r.ok) {
      setMsg({ texto: j.erro ?? "Não foi possível gravar.", tipo: "erro" });
      return;
    }
    setTexto("");
    setMsg({
      texto: j.demo
        ? `Modo demonstração: ${j.criados} item(ns) iriam para a caixa de entrada do Notion.`
        : `${j.criados} item(ns) na caixa de entrada. A triagem com IA acontece às 11h.`,
      tipo: "ok",
    });
  }

  return (
    <form className="cartao" onSubmit={enviar}>
      <div className="campo">
        <label htmlFor="texto">O que chegou? Um item por linha</label>
        <textarea
          id="texto"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={"Pedido de posicionamento sobre o relatório\nLigar para remarcar a consulta\nLer o material da semana 5"}
          required
        />
      </div>
      <div className="grade-2">
        <div className="campo">
          <label htmlFor="origem">Por onde chegou</label>
          <select id="origem" value={origem} onChange={(e) => setOrigem(e.target.value)}>
            <option value="">Não informar</option>
            {ORIGENS.map((o) => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div className="campo">
          <label htmlFor="contexto">Contexto</label>
          <select id="contexto" value={contexto} onChange={(e) => setContexto(e.target.value)}>
            <option value="">Não informar</option>
            {CONTEXTOS.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <CampoPin pin={pin} setPin={setPin} demo={demo} />
      <div className="linha-botoes">
        <button className="botao" disabled={enviando || !texto.trim()}>
          {enviando ? "Gravando…" : "Mandar para a caixa de entrada"}
        </button>
      </div>
      {msg && <p className={`mensagem ${msg.tipo}`} role="status">{msg.texto}</p>}
    </form>
  );
}
