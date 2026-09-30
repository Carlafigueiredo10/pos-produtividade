import Link from "next/link";
import { connection } from "next/server";
import { Cabecalho } from "@/components/Cabecalho";
import { Barras, Colunas, Linha } from "@/components/Graficos";
import { IconeBrilho, IconeBussola, IconeSeta } from "@/components/Icones";
import { carregarDados } from "@/lib/notion";
import { calcularPainel, hojeISO, hora, rotuloDia, semanaAtual } from "@/lib/metricas";
import { QUADRANTES } from "@/lib/tipos";

const INFO_Q: Record<string, { nome: string; dica: string; classe: string }> = {
  "Q1 · Fazer agora": { nome: "Fazer agora", dica: "Urgente · importante", classe: "q1" },
  "Q2 · Agendar": { nome: "Agendar", dica: "Importante · não urgente", classe: "q2" },
  "Q3 · Delegar": { nome: "Delegar", dica: "Urgente · não importante", classe: "q3" },
  "Q4 · Eliminar": { nome: "Eliminar", dica: "Nem um nem outro", classe: "q4" },
};

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
  const diaMaisReunioes = [...p.horasReuniaoPorDia].sort((a, b) => b.horas - a.horas)[0];
  const totalTempo = p.pomodorosPorQuadrante.reduce((t, q) => t + q.valor, 0);
  const fmt = (n: number) => n.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

  return (
    <main className="pagina">
      <Cabecalho icone={<IconeBussola />} titulo="Meu Sistema Operacional">
        {rotuloDia(hoje)} · {semana?.titulo ?? "Semana atual"}. Tarefas, semana, compromissos e acompanhamento em uma
        página só.
      </Cabecalho>

      {dados.fonte === "demo" && (
        <p className="aviso">
          Modo demonstração: o Notion ainda não está conectado, então o painel mostra uma cópia dos dados de exemplo.
        </p>
      )}

      <section className="guia" aria-label="Frase-guia e foco da semana">
        <div>
          <span className="rotulo">Frase-guia</span>
          <strong>Se não está no sistema, não existe.</strong>
        </div>
        <div>
          <span className="rotulo">Foco da semana</span>
          <p>{semana?.foco ?? "Defina no planejamento de domingo."}</p>
        </div>
      </section>

      <section className="kpis" aria-label="Indicadores">
        <div className="kpi">
          <span className="kpi-rotulo">Pomodoros na semana</span>
          <span className="kpi-valor">{p.pomodorosSemana}</span>
          <span className="kpi-detalhe">{fmt(p.minutosFoco / 60)} h de foco · anterior: {p.pomodorosAnterior}</span>
        </div>
        <div className="kpi">
          <span className="kpi-rotulo">Tarefas concluídas</span>
          <span className="kpi-valor">{p.concluidasSemana}</span>
          <span className="kpi-detalhe">semana passada: {p.concluidasAnterior}</span>
        </div>
        <div className="kpi">
          <span className="kpi-rotulo">Energia média (7 dias)</span>
          <span className="kpi-valor">{p.energiaMedia != null ? fmt(p.energiaMedia) : "—"}</span>
          <span className="kpi-detalhe">de 1 a 5, no check-in diário</span>
        </div>
        <div className="kpi">
          <span className="kpi-rotulo">Desconectei no horário</span>
          <span className="kpi-valor bom">{p.desconectei}/{p.diasComCheckin}</span>
          <span className="kpi-detalhe">treino em {p.treinos} dos {p.diasComCheckin} dias</span>
        </div>
        <div className="kpi">
          <span className="kpi-rotulo">Caixa de entrada</span>
          <span className="kpi-valor">{p.caixaEntrada.length}</span>
          <span className="kpi-detalhe">{p.caixaEntrada.length ? "aguardando triagem com IA" : "tudo classificado"}</span>
        </div>
      </section>

      <section className="grade-2">
        <div className="coluna">
          <h2 className="secao-titulo">Hoje</h2>

          <div className="cartao">
            <span className="rotulo">Tarefas do dia</span>
            {p.tarefasHoje.length ? (
              <ul className="lista">
                {p.tarefasHoje.map((t) => {
                  const info = t.quadrante ? INFO_Q[t.quadrante] : null;
                  return (
                    <li key={t.id}>
                      <span className={`bolinha ${info?.classe ?? ""}`} />
                      <span className="titulo">{t.titulo}</span>
                      {info && <span className={`selo ${info.classe}`}>{info.nome}</span>}
                      {t.pomodorosEstimados ? <span className="meta">{t.pomodorosEstimados} pom.</span> : null}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="vazio">Nada vencendo hoje. Bom dia para o quadrante Agendar.</p>
            )}
          </div>

          <div className="cartao">
            <div className="cartao-cab">
              <span className="rotulo">Compromissos de hoje</span>
              <span className="nota">{p.agendaHoje.length}</span>
            </div>
            {p.agendaHoje.length ? (
              <ul className="agenda">
                {p.agendaHoje.map((c) => (
                  <li key={c.id} className={c.inegociavel ? "protegido" : ""}>
                    <span className="horario">{hora(c.inicio)}</span>
                    <span className="traco" aria-hidden />
                    <span>
                      {c.titulo}
                      <span className="tipo">
                        {hora(c.inicio)}{c.fim ? `–${hora(c.fim)}` : ""}
                        {c.preparacao ? ` · ${c.preparacao}` : ""}
                      </span>
                    </span>
                    {c.inegociavel ? <span className="selo verde">Bloco protegido</span> : <span className="nota">{c.tipo}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="vazio">Nenhum compromisso hoje.</p>
            )}
          </div>

          <div className="cartao">
            <span className="rotulo">3 prioridades da semana</span>
            {prioridades.length ? (
              <ol className="passos">
                {prioridades.map((pr) => <li key={pr}>{pr}</li>)}
              </ol>
            ) : (
              <p className="vazio">Defina no planejamento de domingo.</p>
            )}
          </div>
        </div>

        <div className="coluna">
          <h2 className="secao-titulo">Matriz de Eisenhower</h2>
          <div className="matriz">
            {QUADRANTES.map((q) => {
              const info = INFO_Q[q];
              const lista = p.abertas.filter((t) => t.quadrante === q);
              return (
                <div key={q} className={`quadrante ${info.classe}`}>
                  <div className="quadrante-cab">
                    <h3>{info.nome}</h3>
                    <span className="dica">{info.dica}</span>
                  </div>
                  {lista.length ? (
                    <ul>
                      {lista.map((t) => (
                        <li key={t.id}>
                          {t.titulo}
                          <small>
                            {t.contexto}
                            {t.prazo ? ` · até ${rotuloDia(t.prazo)}` : ""}
                            {t.pomodorosEstimados ? ` · ${t.pomodorosEstimados} pom.` : ""}
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
          <p className="nota">
            {p.abertas.length} tarefas abertas. Os itens da caixa de entrada entram na matriz depois da triagem.
          </p>
        </div>
      </section>

      <h2 className="secao-titulo">
        Painel de produtividade <small>dados ao vivo das bases do Notion</small>
      </h2>

      <section className="grade-2">
        <div className="cartao">
          <div className="cartao-cab">
            <h2>Pomodoros por dia</h2>
            <span className="nota">últimos 14 dias · hoje em destaque</span>
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
            <h2>Onde foi o tempo</h2>
            <span className="nota">pomodoros por quadrante</span>
          </div>
          {totalTempo ? (
            <>
              <div className="empilhada" role="img" aria-label="Distribuição dos pomodoros por quadrante">
                {p.pomodorosPorQuadrante.filter((q) => q.valor).map((q) => (
                  <span key={q.rotulo} className={INFO_Q[q.rotulo].classe} style={{ flexGrow: q.valor }} title={`${INFO_Q[q.rotulo].nome}: ${q.valor}`} />
                ))}
              </div>
              <ul className="legenda">
                {p.pomodorosPorQuadrante.map((q) => (
                  <li key={q.rotulo} className={INFO_Q[q.rotulo].classe}>
                    {INFO_Q[q.rotulo].nome}
                    <b>{Math.round((q.valor / totalTempo) * 100)}%</b>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="vazio">Ainda não há pomodoros registrados.</p>
          )}
          <p className="nota divisor">
            Meta: a maior fatia em Agendar. Na revisão de domingo, o Claude lê as bases e sugere o que tirar de
            &quot;Fazer agora&quot; na semana seguinte.
          </p>
        </div>
        <div className="cartao">
          <div className="cartao-cab">
            <h2>Por onde as demandas chegam</h2>
            <span className="nota">todas as tarefas</span>
          </div>
          <Barras dados={p.demandasPorOrigem} unidade="tarefas" />
          {diaMaisReunioes?.horas > 0 && (
            <p className="nota divisor">
              Dia com mais reuniões nesta semana: {diaMaisReunioes.rotulo} ({fmt(diaMaisReunioes.horas)} h).
            </p>
          )}
        </div>
      </section>

      <Link href="/ia" className="cartao atalho" style={{ textDecoration: "none", color: "inherit" }}>
        <span className="icone"><IconeBrilho /></span>
        <div>
          <strong>Prompts do Claude</strong>
          <span className="nota">Triagem da caixa de entrada · planejar a semana · revisão de domingo</span>
        </div>
        <span className="botao secundario">Abrir <IconeSeta className="seta" /></span>
      </Link>
    </main>
  );
}
