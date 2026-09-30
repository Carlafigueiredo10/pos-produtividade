import { capturarNaCaixa, notionConfigurado } from "@/lib/notion";
import { pinValido } from "@/lib/pin";
import { CONTEXTOS, ORIGENS } from "@/lib/tipos";

export async function POST(request: Request) {
  const corpo = await request.json().catch(() => null);
  const itens: string[] = String(corpo?.texto ?? "")
    .split("\n")
    .map((l) => l.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 20);

  if (!itens.length) {
    return Response.json({ erro: "Escreva pelo menos um item." }, { status: 400 });
  }
  if (!notionConfigurado()) {
    return Response.json({ ok: true, demo: true, criados: itens.length });
  }
  if (!pinValido(request)) {
    return Response.json({ erro: "PIN incorreto." }, { status: 401 });
  }

  const origem = (ORIGENS as readonly string[]).includes(corpo.origem) ? corpo.origem : undefined;
  const contexto = (CONTEXTOS as readonly string[]).includes(corpo.contexto) ? corpo.contexto : undefined;
  for (const titulo of itens) {
    await capturarNaCaixa({ titulo: titulo.slice(0, 200), origem, contexto });
  }
  return Response.json({ ok: true, criados: itens.length });
}
