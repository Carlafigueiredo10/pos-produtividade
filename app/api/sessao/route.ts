import { atualizarEtapa, notionConfigurado, registrarSessao } from "@/lib/notion";
import { pinValido } from "@/lib/pin";
import { hojeISO } from "@/lib/metricas";

export async function POST(request: Request) {
  const corpo = await request.json().catch(() => null);
  const minutos = Number(corpo?.minutos);
  if (!corpo || !Number.isFinite(minutos) || minutos <= 0 || minutos > 120) {
    return Response.json({ erro: "Sessão inválida." }, { status: 400 });
  }
  if (!notionConfigurado()) {
    return Response.json({ ok: true, demo: true });
  }
  if (!pinValido(request)) {
    return Response.json({ erro: "PIN incorreto." }, { status: 401 });
  }

  const tarefaId = typeof corpo.tarefaId === "string" && corpo.tarefaId ? corpo.tarefaId : undefined;
  const titulo = String(corpo.titulo ?? "Pomodoro").slice(0, 200);
  await registrarSessao({
    titulo: corpo.concluida ? `Pomodoro · ${titulo}` : `Pomodoro interrompido · ${titulo}`,
    inicio: typeof corpo.inicio === "string" ? corpo.inicio : new Date().toISOString(),
    minutos: Math.round(minutos),
    concluida: Boolean(corpo.concluida),
    tarefaId,
  });

  if (tarefaId && (corpo.marcarComo === "Fazendo" || corpo.marcarComo === "Feito")) {
    await atualizarEtapa(tarefaId, corpo.marcarComo, hojeISO());
  }
  return Response.json({ ok: true });
}
