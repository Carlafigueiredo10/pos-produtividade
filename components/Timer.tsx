"use client";

import { useEffect, useRef, useState } from "react";
import { CampoPin, usePin } from "./Pin";

type TarefaOpcao = { id: string; titulo: string; quadrante: string | null; pomodorosEstimados: number | null };

const FASES = {
  foco: { rotulo: "Foco", minutos: 25 },
  pausa: { rotulo: "Pausa curta", minutos: 5 },
  longa: { rotulo: "Pausa longa", minutos: 15 },
} as const;
type Fase = keyof typeof FASES;

function bip() {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.value = 660;
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.8);
  } catch {}
}

const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export function Timer({ tarefas, demo }: { tarefas: TarefaOpcao[]; demo: boolean }) {
  const [pin, setPin] = usePin();
  const [tarefaId, setTarefaId] = useState(tarefas[0]?.id ?? "");
  const [fase, setFase] = useState<Fase>("foco");
  const [restante, setRestante] = useState(FASES.foco.minutos * 60);
  const [rodando, setRodando] = useState(false);
  const [feitosHoje, setFeitosHoje] = useState(0);
  const [msg, setMsg] = useState<{ texto: string; tipo: "ok" | "erro" | "" }>({ texto: "", tipo: "" });
  const inicioRef = useRef<string | null>(null);
  const fimRef = useRef<number | null>(null);

  const tarefa = tarefas.find((t) => t.id === tarefaId);
  const total = FASES[fase].minutos * 60;

  async function registrar(concluida: boolean, minutos: number, marcarComo?: "Fazendo" | "Feito") {
    const r = await fetch("/api/sessao", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-pos-pin": pin },
      body: JSON.stringify({
        tarefaId: tarefaId || undefined,
        titulo: tarefa?.titulo ?? "Sem tarefa",
        inicio: inicioRef.current ?? new Date().toISOString(),
        minutos,
        concluida,
        marcarComo,
      }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      setMsg({ texto: j.erro ?? "Não foi possível gravar no Notion.", tipo: "erro" });
      return false;
    }
    setMsg({
      texto: j.demo
        ? "Modo demonstração: a sessão seria gravada no Notion."
        : concluida
          ? "Pomodoro gravado no Notion. Hora da pausa."
          : "Interrupção registrada. Anote o que te tirou do foco no check-in.",
      tipo: "ok",
    });
    return true;
  }

  // Relógio baseado no horário de término: não atrasa se a aba ficar em segundo plano.
  useEffect(() => {
    if (!rodando) return;
    const id = setInterval(() => {
      const s = Math.max(0, Math.round(((fimRef.current ?? Date.now()) - Date.now()) / 1000));
      setRestante(s);
      if (s === 0) {
        clearInterval(id);
        setRodando(false);
        bip();
        if (fase === "foco") {
          const n = feitosHoje + 1;
          setFeitosHoje(n);
          registrar(true, FASES.foco.minutos, "Fazendo");
          trocar(n % 4 === 0 ? "longa" : "pausa");
        } else {
          trocar("foco");
        }
      }
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rodando, fase]);

  useEffect(() => {
    document.title = rodando ? `${mmss(restante)} · ${FASES[fase].rotulo}` : "POS · Foco";
  }, [restante, rodando, fase]);

  function trocar(f: Fase) {
    setFase(f);
    setRestante(FASES[f].minutos * 60);
    setRodando(false);
  }

  function iniciar() {
    if (fase === "foco" && restante === total) inicioRef.current = new Date().toISOString();
    fimRef.current = Date.now() + restante * 1000;
    setRodando(true);
    setMsg({ texto: "", tipo: "" });
  }

  async function interromper() {
    const decorridos = Math.max(1, Math.round((total - restante) / 60));
    setRodando(false);
    if (fase === "foco" && restante < total) await registrar(false, decorridos);
    trocar(fase);
  }

  async function concluirTarefa() {
    if (!tarefaId) return;
    const r = await fetch("/api/tarefa", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-pos-pin": pin },
      body: JSON.stringify({ tarefaId, etapa: "Feito" }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) setMsg({ texto: j.erro ?? "Não foi possível atualizar a tarefa.", tipo: "erro" });
    else setMsg({ texto: j.demo ? "Modo demonstração: a tarefa seria marcada como feita." : "Tarefa marcada como feita no Notion. 🎉", tipo: "ok" });
  }

  return (
    <div className="grade-3">
      <div className="cartao">
        <div className="linha-botoes" role="tablist" aria-label="Fase">
          {(Object.keys(FASES) as Fase[]).map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={fase === f}
              className={`botao ${fase === f ? "" : "secundario"}`}
              onClick={() => trocar(f)}
              disabled={rodando}
            >
              {FASES[f].rotulo} · {FASES[f].minutos} min
            </button>
          ))}
        </div>
        <div className="timer">
          <span className="fase">{FASES[fase].rotulo}{tarefa && fase === "foco" ? ` · ${tarefa.titulo}` : ""}</span>
          <span className="relogio" aria-live="off">{mmss(restante)}</span>
          <div className="anel" aria-hidden>
            <span style={{ width: `${((total - restante) / total) * 100}%` }} />
          </div>
          <div className="linha-botoes">
            {rodando ? (
              <button className="botao" onClick={() => { setRodando(false); }}>Pausar</button>
            ) : (
              <button className="botao" onClick={iniciar}>{restante === total ? "Começar" : "Continuar"}</button>
            )}
            <button className="botao secundario" onClick={interromper} disabled={restante === total}>
              {fase === "foco" ? "Fui interrompida" : "Pular pausa"}
            </button>
          </div>
          {msg.texto && <p className={`mensagem ${msg.tipo}`} role="status">{msg.texto}</p>}
        </div>
      </div>

      <div className="cartao">
        <div className="campo">
          <label htmlFor="tarefa">No que vou focar</label>
          <select id="tarefa" value={tarefaId} onChange={(e) => setTarefaId(e.target.value)} disabled={rodando}>
            <option value="">Sem tarefa específica</option>
            {tarefas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.quadrante ? `${t.quadrante.slice(0, 2)} · ` : ""}{t.titulo}
              </option>
            ))}
          </select>
        </div>
        {tarefa?.pomodorosEstimados ? (
          <p className="nota">Estimativa: {tarefa.pomodorosEstimados} pomodoros.</p>
        ) : null}
        <p className="nota">Pomodoros nesta sessão: {feitosHoje}. A cada 4, uma pausa longa.</p>
        <button className="botao secundario" onClick={concluirTarefa} disabled={!tarefaId}>
          Concluí esta tarefa
        </button>
        <CampoPin pin={pin} setPin={setPin} demo={demo} />
        <p className="nota">
          Regras do bloco de foco: Teams e WhatsApp fechados, celular longe, uma tarefa por vez. Se algo novo aparecer,
          vai para a Captura, não para a cabeça.
        </p>
      </div>
    </div>
  );
}
