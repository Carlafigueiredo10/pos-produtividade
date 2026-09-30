import { connection } from "next/server";
import { Timer } from "@/components/Timer";
import { carregarDados } from "@/lib/notion";
import { QUADRANTES } from "@/lib/tipos";

export const metadata = { title: "POS · Foco" };

export default async function Foco() {
  await connection();
  const dados = await carregarDados();
  const ordem = (q: string | null) => (q ? QUADRANTES.indexOf(q as (typeof QUADRANTES)[number]) : 9);
  const tarefas = dados.tarefas
    .filter((t) => t.etapa === "A fazer" || t.etapa === "Fazendo")
    .filter((t) => t.quadrante !== "Q4 · Eliminar")
    .sort((a, b) => ordem(a.quadrante) - ordem(b.quadrante) || (a.prazo ?? "9").localeCompare(b.prazo ?? "9"))
    .map(({ id, titulo, quadrante, pomodorosEstimados }) => ({ id, titulo, quadrante, pomodorosEstimados }));

  return (
    <main className="pagina">
      <div className="cabecalho">
        <span className="sobretitulo">Técnica Pomodoro · 25 min de foco, 5 de pausa</span>
        <h1>Bloco de foco</h1>
        <p className="subtitulo">
          Escolha uma tarefa de Q1 ou Q2 e comece. Cada pomodoro concluído ou interrompido é gravado na base
          &quot;Sessões de foco&quot; do Notion e aparece no painel.
        </p>
      </div>
      <Timer tarefas={tarefas} demo={dados.fonte === "demo"} />
    </main>
  );
}
