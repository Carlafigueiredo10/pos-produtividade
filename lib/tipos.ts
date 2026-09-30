export type Etapa = "Caixa de entrada" | "A fazer" | "Fazendo" | "Feito" | "Descartada";
export type Quadrante = "Q1 · Fazer agora" | "Q2 · Agendar" | "Q3 · Delegar" | "Q4 · Eliminar";

export const QUADRANTES: Quadrante[] = [
  "Q1 · Fazer agora",
  "Q2 · Agendar",
  "Q3 · Delegar",
  "Q4 · Eliminar",
];

export const ORIGENS = ["E-mail", "Teams", "WhatsApp", "Reunião", "Faculdade (AVA)", "Eu mesma"] as const;
export const CONTEXTOS = ["Trabalho", "Faculdade", "Pessoal", "Saúde"] as const;

export type Tarefa = {
  id: string;
  titulo: string;
  etapa: Etapa | null;
  quadrante: Quadrante | null;
  contexto: string | null;
  origem: string | null;
  prazo: string | null;
  pomodorosEstimados: number | null;
  concluidaEm: string | null;
  sugestaoIA: string | null;
};

export type Compromisso = {
  id: string;
  titulo: string;
  inicio: string;
  fim: string | null;
  tipo: string | null;
  inegociavel: boolean;
  preparacao: string | null;
};

export type Checkin = {
  id: string;
  dia: string;
  data: string;
  energia: number | null;
  humor: string | null;
  treino: boolean;
  refeicoes: boolean;
  desconectei: boolean;
  pomodoros: number | null;
  interrupcoes: number | null;
  vitoria: string | null;
};

export type Sessao = {
  id: string;
  titulo: string;
  inicio: string;
  minutos: number;
  concluida: boolean;
  tarefaIds: string[];
};

export type Semana = {
  id: string;
  titulo: string;
  inicio: string | null;
  fim: string | null;
  foco: string | null;
  prioridades: string | null;
  status: string | null;
  revisao: string | null;
};

export type DadosPOS = {
  fonte: "notion" | "demo";
  tarefas: Tarefa[];
  compromissos: Compromisso[];
  checkins: Checkin[];
  sessoes: Sessao[];
  semanas: Semana[];
};
