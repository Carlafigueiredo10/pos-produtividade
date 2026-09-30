import { connection } from "next/server";
import { Barras, Colunas, Linha } from "@/components/Graficos";
import { carregarDados } from "@/lib/notion";
import { calcularPainel, hojeISO, hora, rotuloDia, semanaAtual } from "@/lib/metricas";
import { QUADRANTES } from "@/lib/tipos";

const DICAS: Record<string, string> = {
  "Q1 · Fazer agora": "Urgente e importante",
  "Q2 · Agendar": "Importante, não urgente",
  "Q3 · Delegar": "Urgente, não importante",
  "Q4 · Eliminar": "Nem urgente nem importante",
};

function variacao(atual: number, anterior: number, unidade: string) {
  if (!anterior) return { texto: "primeira semana medida", sobe: false };
  const diff = atual - anterior;
  if (diff === 0) return { texto: `igual à semana passada`, sobe: false };
  return {
    texto: `${diff > 0 ? "+" : ""}${diff} ${unidade} vs. semana passada`,
    sobe: diff > 0,
  };
}

export default async function Painel() {
  await connection();
  const dados = await carregarDados();
  const hoje = hojeISO();
  const p = calcularPainel(dados, hoje);
  const semana = semanaAtual(dados.semanas, hoje);
  const prioridades = (semana?.prioridades ?? "")
    .split("\n")
    .map((l) => l.replace(/^\d+[.)]\s*/, "").trim())
    .filter(Boolean);

  const vPomodoro = variacao(p.pomodorosSemana, p.pomodorosAnterior, "");
  const diaMaisReunioes = [...p.horasReuniaoPorDia].sort((a, b) => b.horas - a.horas)[0];

  return (
    <main className="pagina">
      <div className="cabecalho">
        <span className="sobretitulo">{rotuloDia(hoje)} · {semana?.titulo ?? "Semana atual"}</span>
        <h1>Painel da semana</h1>
        {semana?.foco && <p className="subtitulo">Foco: {semana.foco}</p>}
      </div>

      {dados.fonte === "demo" && (
        <p className="aviso">
          Modo demonstração: o Notion ainda não está conectado, então o painel mostra uma cópia dos dados de exemplo.
        </p>
      )}

      <section className="kpis" aria-label="Indicadores">
        <div className="kpi">
          <span className="kpi-rotulo">Pomodoros na semana</span>
          <span className="kpi-valor">{p.pomodorosSemana}</span>
          <span className={`kpi-detalhe ${vPomodoro.sobe ? "sobe" : ""}`}>
            {Math.round(p.minutosFoco / 60 * 10) / 10} h de foco · semana passada: {p.pomodorosAnterior}
          </span>
        </div>
        <div className="kpi">
          <span className="kpi-rotulo">Tarefas concluídas</span>
          <span className="kpi-valor">{p.concluidasSemana}</span>
          <span className="kpi-detalhe">semana passada: {p.concluidasAnterior}</span>
        </div>
        <div className="kpi">
          <span className="kpi-rotulo">Energia média (7 dias)</span>
          <span className="kpi-valor">{p.energiaMedia?.toFixed(1).replace(".", ",") ?? "—"}</span>
          <span className="kpi-detalhe">escala de 1 a 5, check-in diário</span>
        </div>
        <div className="kpi">
          <span className="kpi-rotulo">Desconectei no horário</span>
          <span className="kpi-valor">{p.desconectei}/{p.diasComCheckin}</span>
          <span className="kpi-detalhe">treino em {p.treinos} dos {p.diasComCheckin} dias</span>
        </div>
        <div className="kpi">
          <span className="kpi-rotulo">Caixa de entrada</span>
          <span className="kpi-valor">{p.caixaEntrada.length}</span>
          <span className="kpi-detalhe">{p.caixaEntrada.length ? "aguardando triagem com IA" : "tudo classificado"}</span>
        </div>
      </section>

      <section className="semana">
        <div className="cartao">
          <div className="cartao-cab">
            <h2>Matriz de Eisenhower</h2>
            <span className="nota">{p.abertas.length} tarefas abertas</span>
          </div>
          <div className="matriz">
            {QUADRANTES.map((q, i) => {
              const lista = p.abertas.filter((t) => t.quadrante === q);
              return (
                <div key={q} className={`quadrante q${i + 1}`}>
                  <h3>{q}</h3>
                  <span className="dica">{DICAS[q]}</span>
                  {lista.length ? (
                    <ul>
                      {lista.map((t) => (
                        <li key={t.id}>
                          {t.titulo}
                          <small>
                            {t.contexto}
                            {t.prazo ? ` · prazo ${rotuloDia(t.prazo)}` : ""}
                            {t.pomodorosEstimados ? ` · ${t.pomodorosEstimados} 🍅` : ""}
                          </small>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="vazio">Nada aqui.</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: "grid", gap: 20, alignContent: "start" }}>
          <div className="cartao">
            <h2>3 prioridades da semana</h2>
            {prioridades.length ? (
              <ol className="prioridades">
                {prioridades.map((pr) => <li key={pr}>{pr}</li>)}
              </ol>
            ) : (
              <p className="vazio">Defina no planejamento de domingo.</p>
            )}
          </div>
          <div className="cartao">
            <div className="cartao-cab">
              <h2>Agenda de hoje</h2>
              <span className="nota">{p.agendaHoje.length} compromissos</span>
            </div>
            {p.agendaHoje.length ? (
              <ul className="agenda">
                {p.agendaHoje.map((c) => (
                  <li key={c.id}>
                    <span className="horario">{hora(c.inicio)}{c.fim ? `–${hora(c.fim)}` : ""}</span>
                    <span>
                      {c.titulo}
                      {c.inegociavel && <span className="selo">inegociável</span>}
                      <br />
                      <span className="tipo">{c.tipo}{c.preparacao ? ` · ${c.preparacao}` : ""}</span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="vazio">Nenhum compromisso hoje.</p>
            )}
          </div>
        </div>
      </section>

      <section className="grade-2">
        <div className="cartao">
          <div className="cartao-cab">
            <h2>Pomodoros por dia</h2>
            <span className="nota">últimos 14 dias</span>
          </div>
          <Colunas dados={p.pomodorosPorDia} unidade="pomodoros" />
        </div>
        <div className="cartao">
          <div className="cartao-cab">
            <h2>Energia no fim do dia</h2>
            <span className="nota">check-in diário, 1 a 5</span>
          </div>
          <Linha dados={p.energiaPorDia} unidade="energia" />
        </div>
      </section>

      <section className="grade-2">
        <div className="cartao">
          <div className="cartao-cab">
            <h2>Tarefas concluídas por quadrante</h2>
            <span className="nota">desde o início do sistema</span>
          </div>
          <Barras dados={p.concluidasPorQuadrante} unidade="tarefas" />
          <p className="nota">
            Quanto mais tarefas em Q2, mais tempo vai para o que é importante antes de virar urgente.
          </p>
        </div>
        <div className="cartao">
          <div className="cartao-cab">
            <h2>Por onde as demandas chegam</h2>
            <span className="nota">todas as tarefas</span>
          </div>
          <Barras dados={p.demandasPorOrigem} unidade="tarefas" />
          {diaMaisReunioes?.horas > 0 && (
            <p className="nota">
              Dia com mais reuniões nesta semana: {diaMaisReunioes.rotulo} ({diaMaisReunioes.horas.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} h).
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
