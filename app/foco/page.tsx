import { connection } from "next/server";
import { Timer } from "@/components/Timer";
import { Cabecalho } from "@/components/Cabecalho";
import { IconeTimer } from "@/components/Icones";
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
      <Cabecalho icone={<IconeTimer />} titulo="Bloco de foco">
        Técnica Pomodoro: 25 minutos de foco e 5 de pausa. Escolha uma tarefa de Q1 ou Q2 e comece. Cada pomodoro,
        concluído ou interrompido, é gravado na base &quot;Sessões de foco&quot; do Notion e aparece no painel.
      </Cabecalho>
      <Timer tarefas={tarefas} demo={dados.fonte === "demo"} />
    </main>
  );
}
