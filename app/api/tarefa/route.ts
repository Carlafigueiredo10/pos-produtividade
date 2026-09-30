import { atualizarEtapa, notionConfigurado } from "@/lib/notion";
import { pinValido } from "@/lib/pin";
import { hojeISO } from "@/lib/metricas";

export async function PATCH(request: Request) {
  const corpo = await request.json().catch(() => null);
  if (typeof corpo?.tarefaId !== "string" || !["Fazendo", "Feito"].includes(corpo?.etapa)) {
    return Response.json({ erro: "Pedido inválido." }, { status: 400 });
  }
  if (!notionConfigurado()) return Response.json({ ok: true, demo: true });
  if (!pinValido(request)) return Response.json({ erro: "PIN incorreto." }, { status: 401 });

  await atualizarEtapa(corpo.tarefaId, corpo.etapa, hojeISO());
  return Response.json({ ok: true });
}
