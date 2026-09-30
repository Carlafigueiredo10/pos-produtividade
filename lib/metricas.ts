import { QUADRANTES, type DadosPOS, type Semana } from "./tipos";

const FUSO = "America/Sao_Paulo";

/** Data de hoje (AAAA-MM-DD) no fuso de Brasília. */
export function hojeISO(agora = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: FUSO }).format(agora);
}

/** Converte um instante (ou data pura) para o dia AAAA-MM-DD em Brasília. */
export function diaDe(valor: string) {
  if (valor.length === 10) return valor;
  return hojeISO(new Date(valor));
}

export function somarDias(dia: string, n: number) {
  const d = new Date(`${dia}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Segunda-feira da semana que contém `dia`. */
export function segundaDe(dia: string) {
  const d = new Date(`${dia}T12:00:00Z`);
  const semana = (d.getUTCDay() + 6) % 7;
  return somarDias(dia, -semana);
}

const DIAS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];
export function rotuloDia(dia: string) {
  const d = new Date(`${dia}T12:00:00Z`);
  return `${DIAS[d.getUTCDay()]} ${dia.slice(8, 10)}/${dia.slice(5, 7)}`;
}

export function hora(valor: string) {
  if (valor.length === 10) return "";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: FUSO, hour: "2-digit", minute: "2-digit" }).format(new Date(valor));
}

export function semanaAtual(semanas: Semana[], hoje: string): Semana | null {
  const contem = semanas.find((s) => s.inicio && s.fim && s.inicio <= hoje && hoje <= s.fim);
  if (contem) return contem;
  return [...semanas].sort((a, b) => (b.inicio ?? "").localeCompare(a.inicio ?? ""))[0] ?? null;
}

export function calcularPainel(dados: DadosPOS, hoje: string) {
  const inicioSemana = segundaDe(hoje);
  const fimSemana = somarDias(inicioSemana, 6);
  const inicioAnterior = somarDias(inicioSemana, -7);
  const naSemana = (dia: string, ini: string, fim: string) => ini <= dia && dia <= fim;

  const sessoesOk = dados.sessoes.filter((s) => s.concluida);
  const pomodorosSemana = sessoesOk.filter((s) => naSemana(diaDe(s.inicio), inicioSemana, fimSemana)).length;
  const pomodorosAnterior = sessoesOk.filter((s) => naSemana(diaDe(s.inicio), inicioAnterior, somarDias(inicioSemana, -1))).length;
  const minutosFoco = sessoesOk
    .filter((s) => naSemana(diaDe(s.inicio), inicioSemana, fimSemana))
    .reduce((t, s) => t + s.minutos, 0);

  const concluidasSemana = dados.tarefas.filter(
    (t) => t.etapa === "Feito" && t.concluidaEm && naSemana(t.concluidaEm, inicioSemana, fimSemana),
  ).length;
  const concluidasAnterior = dados.tarefas.filter(
    (t) => t.etapa === "Feito" && t.concluidaEm && naSemana(t.concluidaEm, inicioAnterior, somarDias(inicioSemana, -1)),
  ).length;

  const ultimos7 = dados.checkins
    .filter((c) => c.data <= hoje && c.data > somarDias(hoje, -7))
    .sort((a, b) => a.data.localeCompare(b.data));
  const comEnergia = ultimos7.filter((c) => c.energia != null);
  const energiaMedia = comEnergia.length
    ? comEnergia.reduce((t, c) => t + (c.energia ?? 0), 0) / comEnergia.length
    : null;
  const desconectei = ultimos7.filter((c) => c.desconectei).length;
  const treinos = ultimos7.filter((c) => c.treino).length;

  const caixaEntrada = dados.tarefas.filter((t) => t.etapa === "Caixa de entrada");
  const abertas = dados.tarefas.filter((t) => t.etapa === "A fazer" || t.etapa === "Fazendo");

  // Séries dos últimos 14 dias
  const dias14 = Array.from({ length: 14 }, (_, i) => somarDias(hoje, i - 13));
  const pomodorosPorDia = dias14.map((dia) => ({
    rotulo: rotuloDia(dia),
    valor: sessoesOk.filter((s) => diaDe(s.inicio) === dia).length,
  }));
  const energiaPorDia = dados.checkins
    .filter((c) => c.energia != null && c.data >= dias14[0] && c.data <= hoje)
    .sort((a, b) => a.data.localeCompare(b.data))
    .map((c) => ({ rotulo: rotuloDia(c.data), valor: c.energia as number }));

  const concluidasPorQuadrante = QUADRANTES.map((q) => ({
    rotulo: q,
    valor: dados.tarefas.filter((t) => t.etapa === "Feito" && t.quadrante === q).length,
  }));

  const origens = new Map<string, number>();
  for (const t of dados.tarefas) {
    if (t.origem) origens.set(t.origem, (origens.get(t.origem) ?? 0) + 1);
  }
  const demandasPorOrigem = [...origens.entries()]
    .map(([rotulo, valor]) => ({ rotulo, valor }))
    .sort((a, b) => b.valor - a.valor);

  const agendaHoje = dados.compromissos
    .filter((c) => diaDe(c.inicio) === hoje)
    .sort((a, b) => a.inicio.localeCompare(b.inicio));

  const horasReuniaoPorDia = Array.from({ length: 7 }, (_, i) => somarDias(inicioSemana, i)).map((dia) => {
    const minutos = dados.compromissos
      .filter((c) => c.tipo === "Reunião" && diaDe(c.inicio) === dia && c.fim)
      .reduce((t, c) => t + (new Date(c.fim!).getTime() - new Date(c.inicio).getTime()) / 60000, 0);
    return { dia, rotulo: rotuloDia(dia), horas: minutos / 60 };
  });

  return {
    inicioSemana,
    fimSemana,
    pomodorosSemana,
    pomodorosAnterior,
    minutosFoco,
    concluidasSemana,
    concluidasAnterior,
    energiaMedia,
    desconectei,
    treinos,
    diasComCheckin: ultimos7.length,
    caixaEntrada,
    abertas,
    pomodorosPorDia,
    energiaPorDia,
    concluidasPorQuadrante,
    demandasPorOrigem,
    agendaHoje,
    horasReuniaoPorDia,
  };
}
