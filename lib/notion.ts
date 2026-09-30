import "server-only";
import type { Checkin, Compromisso, DadosPOS, Semana, Sessao, Tarefa } from "./tipos";
import { dadosDemo } from "./demo";

const NOTION_VERSION = "2022-06-28";

// IDs das bases criadas no Notion. Podem ser sobrescritos por variáveis de ambiente.
export const BASES = {
  tarefas: process.env.NOTION_DB_TAREFAS ?? "84ab331b1395413193c99e7d0da8fa69",
  semanas: process.env.NOTION_DB_SEMANAS ?? "6d46ed9d6f8b49eb9d847b33df0ff3f8",
  compromissos: process.env.NOTION_DB_COMPROMISSOS ?? "49baf41072ab4f398f9fcf2674079bb4",
  checkins: process.env.NOTION_DB_CHECKINS ?? "60a0a9c3cbde4fe1ae84cf50d920213a",
  sessoes: process.env.NOTION_DB_SESSOES ?? "81bf5dd400e34bcab7c3fdf5fc317604",
};

export function notionConfigurado() {
  return Boolean(process.env.NOTION_TOKEN);
}

async function notion(path: string, body: unknown) {
  const res = await fetch(`https://api.notion.com/v1/${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Notion ${path}: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

type Pagina = { id: string; properties: Record<string, any> };

async function consultar(baseId: string): Promise<Pagina[]> {
  const paginas: Pagina[] = [];
  let cursor: string | undefined;
  do {
    const r = await notion(`databases/${baseId}/query`, {
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {}),
    });
    paginas.push(...r.results);
    cursor = r.has_more ? r.next_cursor : undefined;
  } while (cursor);
  return paginas;
}

// Leitores de propriedade
const texto = (p: any): string | null => {
  const partes = p?.title ?? p?.rich_text;
  if (!partes?.length) return null;
  return partes.map((t: any) => t.plain_text).join("");
};
const selecao = (p: any): string | null => p?.select?.name ?? null;
const numero = (p: any): number | null => p?.number ?? null;
const marcado = (p: any): boolean => Boolean(p?.checkbox);
const dataInicio = (p: any): string | null => p?.date?.start ?? null;
const dataFim = (p: any): string | null => p?.date?.end ?? null;
const relacoes = (p: any): string[] => (p?.relation ?? []).map((r: any) => r.id);

function paraTarefa({ id, properties: p }: Pagina): Tarefa {
  return {
    id,
    titulo: texto(p["Tarefa"]) ?? "(sem título)",
    etapa: selecao(p["Etapa"]) as Tarefa["etapa"],
    quadrante: selecao(p["Quadrante"]) as Tarefa["quadrante"],
    contexto: selecao(p["Contexto"]),
    origem: selecao(p["Origem"]),
    prazo: dataInicio(p["Prazo"]),
    pomodorosEstimados: numero(p["Pomodoros estimados"]),
    concluidaEm: dataInicio(p["Concluída em"]),
    sugestaoIA: texto(p["Sugestão da IA"]),
  };
}

function paraCompromisso({ id, properties: p }: Pagina): Compromisso {
  return {
    id,
    titulo: texto(p["Compromisso"]) ?? "(sem título)",
    inicio: dataInicio(p["Quando"]) ?? "",
    fim: dataFim(p["Quando"]),
    tipo: selecao(p["Tipo"]),
    inegociavel: marcado(p["Inegociável"]),
    preparacao: texto(p["Preparação"]),
  };
}

function paraCheckin({ id, properties: p }: Pagina): Checkin {
  return {
    id,
    dia: texto(p["Dia"]) ?? "",
    data: dataInicio(p["Data"]) ?? "",
    energia: numero(p["Energia"]),
    humor: selecao(p["Humor"]),
    treino: marcado(p["Treino"]),
    refeicoes: marcado(p["Refeições preparadas"]),
    desconectei: marcado(p["Desconectei no horário"]),
    pomodoros: numero(p["Pomodoros"]),
    interrupcoes: numero(p["Interrupções"]),
    vitoria: texto(p["Uma vitória do dia"]),
  };
}

function paraSessao({ id, properties: p }: Pagina): Sessao {
  return {
    id,
    titulo: texto(p["Sessão"]) ?? "",
    inicio: dataInicio(p["Início"]) ?? "",
    minutos: numero(p["Minutos"]) ?? 0,
    concluida: marcado(p["Concluída"]),
    tarefaIds: relacoes(p["Tarefa"]),
  };
}

function paraSemana({ id, properties: p }: Pagina): Semana {
  return {
    id,
    titulo: texto(p["Semana"]) ?? "",
    inicio: dataInicio(p["Período"]),
    fim: dataFim(p["Período"]),
    foco: texto(p["Foco da semana"]),
    prioridades: texto(p["3 prioridades"]),
    status: selecao(p["Status"]),
    revisao: texto(p["Revisão (IA)"]),
  };
}

export async function carregarDados(): Promise<DadosPOS> {
  if (!notionConfigurado()) return dadosDemo;

  const [tarefas, compromissos, checkins, sessoes, semanas] = await Promise.all([
    consultar(BASES.tarefas),
    consultar(BASES.compromissos),
    consultar(BASES.checkins),
    consultar(BASES.sessoes),
    consultar(BASES.semanas),
  ]);

  return {
    fonte: "notion",
    tarefas: tarefas.map(paraTarefa),
    compromissos: compromissos.map(paraCompromisso).filter((c) => c.inicio),
    checkins: checkins.map(paraCheckin).filter((c) => c.data),
    sessoes: sessoes.map(paraSessao).filter((s) => s.inicio),
    semanas: semanas.map(paraSemana),
  };
}

// Escritas (usadas pelas rotas de API)
export async function registrarSessao(s: {
  titulo: string;
  inicio: string;
  minutos: number;
  concluida: boolean;
  tarefaId?: string;
}) {
  return notion("pages", {
    parent: { database_id: BASES.sessoes },
    properties: {
      "Sessão": { title: [{ text: { content: s.titulo } }] },
      "Início": { date: { start: s.inicio } },
      Minutos: { number: s.minutos },
      "Concluída": { checkbox: s.concluida },
      "Registrada por": { select: { name: "App POS" } },
      ...(s.tarefaId ? { Tarefa: { relation: [{ id: s.tarefaId }] } } : {}),
    },
  });
}

export async function capturarNaCaixa(c: { titulo: string; origem?: string; contexto?: string }) {
  return notion("pages", {
    parent: { database_id: BASES.tarefas },
    properties: {
      Tarefa: { title: [{ text: { content: c.titulo } }] },
      Etapa: { select: { name: "Caixa de entrada" } },
      ...(c.origem ? { Origem: { select: { name: c.origem } } } : {}),
      ...(c.contexto ? { Contexto: { select: { name: c.contexto } } } : {}),
    },
  });
}

export async function atualizarEtapa(tarefaId: string, etapa: "Fazendo" | "Feito", hoje: string) {
  const res = await fetch(`https://api.notion.com/v1/pages/${tarefaId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        Etapa: { select: { name: etapa } },
        ...(etapa === "Feito" ? { "Concluída em": { date: { start: hoje } } } : {}),
      },
    }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Notion pages/${tarefaId}: ${res.status} ${await res.text()}`);
  return res.json();
}
