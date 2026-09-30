// Cópia dos dados de exemplo do Notion. Usada quando NOTION_TOKEN não está configurado,
// para que o app funcione em modo demonstração.
import type { Compromisso, DadosPOS, Quadrante, Sessao, Tarefa } from "./tipos";

const S39 = "semana-39";
const S40 = "semana-40";

function t(
  id: string,
  titulo: string,
  etapa: Tarefa["etapa"],
  quadrante: Quadrante | null,
  contexto: string,
  origem: string,
  prazo: string | null,
  pomodorosEstimados: number | null,
  concluidaEm: string | null,
  sugestaoIA: string | null,
): Tarefa {
  return { id, titulo, etapa, quadrante, contexto, origem, prazo, pomodorosEstimados, concluidaEm, sugestaoIA };
}

const tarefas: Tarefa[] = [
  t("rel", "Consolidar relatório mensal de riscos da equipe", "Feito", "Q1 · Fazer agora", "Trabalho", "E-mail", "2026-09-25", 6, "2026-09-24", "Prazo em 4 dias e alimenta decisão da chefia: urgente e importante."),
  t("parecer", "Revisar parecer técnico sobre uso de IA generativa (versão da equipe)", "Feito", "Q1 · Fazer agora", "Trabalho", "Teams", "2026-09-23", 3, "2026-09-23", "A equipe está bloqueada esperando sua revisão."),
  t("matriz", "Estruturar a matriz de riscos do novo processo (rascunho)", "Feito", "Q2 · Agendar", "Trabalho", "Eu mesma", null, 4, "2026-09-26", "Estratégico e sem prazo imediato: agendar em bloco de foco antes que vire incêndio."),
  t("dados", "Responder pedido de dados de outra área sobre controles internos", "Feito", "Q3 · Delegar", "Trabalho", "E-mail", "2026-09-22", 1, "2026-09-22", "Urgente para quem pede, mas a equipe tem os dados: delegar com orientação clara."),
  t("umum", "1:1 com integrantes da equipe (pauta de desenvolvimento)", "Feito", "Q2 · Agendar", "Trabalho", "Eu mesma", null, 2, "2026-09-25", "Cuidar da equipe é importante e quase nunca urgente: proteger na agenda."),
  t("trilha", "Ler a trilha da semana na UniFECAF (Gestão do Tempo)", "Feito", "Q2 · Agendar", "Faculdade", "Faculdade (AVA)", null, 3, "2026-09-23", "Base para o trabalho do mês: fazer cedo evita a última hora."),
  t("diag", "Trabalho Produtividade: diagnóstico da rotina", "Feito", "Q2 · Agendar", "Faculdade", "Faculdade (AVA)", "2026-10-02", 2, "2026-09-27", "Primeira parte do trabalho grande do mês, fatiada para não acumular."),
  t("exames", "Agendar exames de rotina", "Feito", "Q2 · Agendar", "Saúde", "Eu mesma", null, 1, "2026-09-22", "Saúde é Q2 clássico: se não agendar, vira Q1 depois."),
  t("cardapio", "Planejar cardápio e compras da semana", "Feito", "Q2 · Agendar", "Pessoal", "Eu mesma", null, 1, "2026-09-21", "Reduz decisão diária e protege o bloco fixo de refeições."),
  t("painel", "Atualizar indicadores do painel de controles internos", "A fazer", "Q2 · Agendar", "Trabalho", "Eu mesma", "2026-10-01", 3, null, "Ficou da semana 39. Encaixar no bloco de foco de quarta."),
  t("estudo", "Estudar referências sobre avaliação de impacto de IA", "A fazer", "Q2 · Agendar", "Trabalho", "Eu mesma", null, 2, null, "Ficou da semana 39. Desenvolvimento próprio: 2 pomodoros na sexta."),
  t("pasta", "Organizar pasta compartilhada da equipe", "Descartada", "Q4 · Eliminar", "Trabalho", "Eu mesma", null, 2, null, "Nem urgente nem importante agora. Propor que cada um organize a própria área."),
  t("teoria", "Trabalho Produtividade: parte teórica", "Fazendo", "Q1 · Fazer agora", "Faculdade", "Faculdade (AVA)", "2026-10-02", 4, null, "Prazo na sexta. Já começou cedo, então cabe em 2 noites."),
  t("sistema", "Trabalho Produtividade: montar sistema no Notion + dashboard", "Fazendo", "Q1 · Fazer agora", "Faculdade", "Faculdade (AVA)", "2026-10-02", 5, null, "Maior parte do trabalho. Começar pelo mais trabalhoso enquanto há folga."),
  t("video", "Trabalho Produtividade: gravar vídeo pitch (4 min)", "A fazer", "Q2 · Agendar", "Faculdade", "Faculdade (AVA)", "2026-10-02", 2, null, "Depende do sistema pronto. Agendar para quinta à noite."),
  t("reuniao", "Preparar reunião de acompanhamento da matriz de riscos", "A fazer", "Q1 · Fazer agora", "Trabalho", "Reunião", "2026-09-30", 2, null, "Reunião amanhã e você conduz: preparar hoje no bloco de foco."),
  t("ferias", "Aprovar escala de férias da equipe", "Feito", "Q1 · Fazer agora", "Trabalho", "E-mail", "2026-09-29", 1, "2026-09-28", "Prazo do sistema de gestão de pessoas vence hoje."),
  t("consulta", "Consolidar contribuições para consulta interna", "A fazer", "Q3 · Delegar", "Trabalho", "Teams", "2026-10-01", 2, null, "Tarefa operacional com prazo: delegar para alguém da equipe e revisar só o final."),
  t("revisao", "Revisão semanal com IA (domingo)", "A fazer", "Q2 · Agendar", "Pessoal", "Eu mesma", "2026-10-04", 1, null, "Ritual fixo que mantém o sistema vivo."),
  t("cx1", "Mensagem no WhatsApp pedindo parecer \"pra ontem\"", "Caixa de entrada", null, "Trabalho", "WhatsApp", null, null, null, null),
  t("cx2", "Convite para palestra sobre governança de IA em novembro", "Caixa de entrada", null, "Trabalho", "E-mail", null, null, null, null),
  t("cx3", "Renovar a matrícula da academia", "Caixa de entrada", null, "Saúde", "Eu mesma", null, null, null, null),
  t("cx4", "Fórum da disciplina: postar reflexão até domingo", "Caixa de entrada", null, "Faculdade", "Faculdade (AVA)", null, null, null, null),
];

// [dia, hora, minutos, tarefa, concluída]
const sessoesBrutas: [string, string, number, string, boolean][] = [
  ["2026-09-21", "08:00", 25, "rel", true], ["2026-09-21", "08:30", 25, "rel", true],
  ["2026-09-21", "09:00", 25, "rel", true], ["2026-09-21", "19:30", 25, "cardapio", true],
  ["2026-09-22", "08:00", 25, "rel", true], ["2026-09-22", "08:30", 25, "rel", true],
  ["2026-09-22", "09:00", 25, "parecer", true], ["2026-09-22", "11:00", 25, "dados", true],
  ["2026-09-22", "14:00", 25, "exames", true], ["2026-09-23", "10:40", 9, "rel", false],
  ["2026-09-24", "08:00", 25, "rel", true], ["2026-09-24", "08:30", 25, "matriz", true],
  ["2026-09-24", "09:00", 25, "matriz", true], ["2026-09-24", "09:30", 25, "matriz", true],
  ["2026-09-24", "16:00", 25, "estudo", true], ["2026-09-25", "08:00", 25, "umum", true],
  ["2026-09-25", "08:30", 25, "umum", true], ["2026-09-25", "14:00", 25, "matriz", true],
  ["2026-09-26", "10:00", 25, "matriz", true], ["2026-09-26", "10:30", 25, "diag", true],
  ["2026-09-27", "10:00", 25, "diag", true], ["2026-09-27", "10:30", 25, "estudo", true],
  ["2026-09-28", "08:00", 25, "ferias", true], ["2026-09-28", "08:30", 25, "painel", true],
  ["2026-09-28", "19:30", 25, "teoria", true], ["2026-09-28", "20:00", 25, "teoria", true],
  ["2026-09-28", "20:30", 25, "sistema", true],
];

const sessoes: Sessao[] = sessoesBrutas.map(([dia, hora, minutos, tarefa, concluida], i) => ({
  id: `s${i}`,
  titulo: `Pomodoro · ${tarefas.find((x) => x.id === tarefa)?.titulo ?? ""}`,
  inicio: `${dia}T${hora}:00.000-03:00`,
  minutos,
  concluida,
  tarefaIds: [tarefa],
}));

function c(dia: string, ini: string, fim: string, titulo: string, tipo: string, inegociavel = false, preparacao: string | null = null): Compromisso {
  return {
    id: `${dia}-${ini}-${titulo}`,
    titulo,
    inicio: `${dia}T${ini}:00.000-03:00`,
    fim: `${dia}T${fim}:00.000-03:00`,
    tipo,
    inegociavel,
    preparacao,
  };
}

const diasUteis = ["2026-09-28", "2026-09-29", "2026-09-30", "2026-10-01", "2026-10-02"];
const compromissos: Compromisso[] = [
  ...diasUteis.flatMap((d, i) => [
    c(d, "08:00", "10:00", "Bloco de foco (sem Teams, sem WhatsApp)", "Bloco de foco", true),
    c(d, "12:00", "13:00", "Almoço preparado + pausa longe da tela", "Bloco fixo · Refeições", true),
    c(d, "18:00", "19:00", "Treino", "Bloco fixo · Treino", true),
    ...(i < 4 ? [c(d, "19:30", "21:00", "Faculdade UniFECAF (EAD)", "Faculdade")] : []),
  ]),
  c("2026-10-03", "09:00", "10:00", "Treino", "Bloco fixo · Treino", true),
  c("2026-10-04", "09:00", "10:00", "Treino", "Bloco fixo · Treino", true),
  c("2026-10-04", "10:30", "12:30", "Preparo das marmitas da semana", "Bloco fixo · Refeições", true, "Cardápio e lista de compras feitos no sábado"),
  c("2026-10-03", "14:00", "17:00", "Faculdade: sessão longa do trabalho do mês", "Faculdade", false, "Checar a rubrica de avaliação antes de começar"),
  c("2026-10-04", "19:00", "19:45", "Revisão semanal com IA", "Bloco de foco", true, "Exportar tarefas da semana e rodar o prompt de revisão"),
  c("2026-09-28", "10:30", "11:30", "Reunião de coordenação com a equipe", "Reunião"),
  c("2026-09-29", "14:00", "15:00", "Reunião com a diretoria: pauta de riscos", "Reunião", false, "Levar status das 3 prioridades do mês"),
  c("2026-09-30", "10:30", "12:00", "Acompanhamento da matriz de riscos", "Reunião", false, "Rascunho da matriz + pontos de decisão"),
  c("2026-09-30", "15:00", "16:30", "Comitê interno de governança de IA", "Reunião", false, "Ler a ata anterior"),
  c("2026-10-01", "11:00", "11:45", "Alinhamento com área parceira", "Reunião"),
  c("2026-10-02", "09:00", "17:00", "Dia presencial: agenda de equipe", "Dia presencial", false, "Sem reuniões depois das 17h"),
  c("2026-10-02", "10:30", "12:00", "1:1 com integrantes da equipe", "Reunião", false, "Pauta de desenvolvimento de cada pessoa"),
  c("2026-10-02", "20:00", "20:30", "Entrega do trabalho de Produtividade (prazo)", "Faculdade", false, "Teoria + link do sistema + vídeo"),
];

// [dia, data, energia, humor, treino, refeições, desconectei, pomodoros, interrupções, vitória]
const checkinsBrutos: [string, string, number, string, boolean, boolean, boolean, number, number, string][] = [
  ["Seg 21/09", "2026-09-21", 3, "😐 Neutro", true, true, false, 4, 11, "Tirei tudo da cabeça: 23 itens na caixa de entrada."],
  ["Ter 22/09", "2026-09-22", 3, "🙂 Bom", true, true, true, 5, 9, "Deleguei o pedido de dados em vez de fazer eu mesma."],
  ["Qua 23/09", "2026-09-23", 2, "😣 Difícil", false, false, false, 0, 15, "Mesmo com 6 reuniões, o parecer da equipe saiu revisado."],
  ["Qui 24/09", "2026-09-24", 3, "🙂 Bom", true, true, true, 5, 8, "Relatório mensal entregue um dia antes do prazo."],
  ["Sex 25/09 (presencial)", "2026-09-25", 4, "😄 Ótimo", true, true, true, 3, 6, "1:1 com a equipe sem olhar o celular."],
  ["Sáb 26/09", "2026-09-26", 4, "🙂 Bom", true, true, true, 2, 2, "Rascunho da matriz de riscos pronto sem pressa."],
  ["Dom 27/09", "2026-09-27", 4, "🙂 Bom", false, true, true, 2, 1, "Trabalho da faculdade começado 5 dias antes do prazo."],
  ["Seg 28/09", "2026-09-28", 4, "🙂 Bom", true, true, true, 5, 6, "WhatsApp só nos 3 horários combinados."],
];

export const dadosDemo: DadosPOS = {
  fonte: "demo",
  tarefas,
  sessoes,
  compromissos,
  checkins: checkinsBrutos.map(([dia, data, energia, humor, treino, refeicoes, desconectei, pomodoros, interrupcoes, vitoria]) => ({
    id: data,
    dia,
    data,
    energia,
    humor,
    treino,
    refeicoes,
    desconectei,
    pomodoros,
    interrupcoes,
    vitoria,
  })),
  semanas: [
    {
      id: S39,
      titulo: "Semana 39 · 21 a 27/set",
      inicio: "2026-09-21",
      fim: "2026-09-27",
      foco: "Primeira semana do sistema: tirar tudo da cabeça e colocar na caixa de entrada.",
      prioridades: "1. Consolidar o relatório mensal de riscos da equipe\n2. Começar o trabalho de Produtividade da faculdade (sem deixar pra última hora)\n3. Treinar pelo menos 4 dias",
      status: "Revisada",
      revisao: "Você fechou 9 de 12 tarefas planejadas e fez 21 pomodoros. O relatório mensal saiu na quinta, um dia antes do prazo. O ponto de atenção é a quarta-feira: 6 reuniões seguidas, energia 2 e nenhum pomodoro.",
    },
    {
      id: S40,
      titulo: "Semana 40 · 28/set a 4/out",
      inicio: "2026-09-28",
      fim: "2026-10-04",
      foco: "Entregar o trabalho de Produtividade da faculdade com folga e proteger os blocos de foco da quarta.",
      prioridades: "1. Trabalho da faculdade: teoria + sistema + vídeo até sexta\n2. Preparar a reunião de acompanhamento da matriz de riscos\n3. Desconectar às 18h em pelo menos 4 dias",
      status: "Em andamento",
      revisao: null,
    },
  ],
};
