import type { DadosPOS } from "./tipos";
import { diaDe, hora, rotuloDia, segundaDe, semanaAtual, somarDias } from "./metricas";

const PERFIL =
  "Sou servidora pública federal, coordeno uma equipe e trabalho com gestão de riscos e governança de IA. Trabalho remoto com 1 dia presencial por semana. Estudo à noite (EAD) e tenho um trabalho grande da faculdade por mês.";

const REGRAS_FIXAS = `Regras fixas (não podem ser movidas):
- Treino 1h por dia (18h nos dias úteis, 9h no fim de semana).
- Almoço 12h–13h longe da tela. Preparo das marmitas no domingo de manhã.
- Faculdade de segunda a quinta, 19h30–21h.
- Bloco de foco 8h–10h todos os dias úteis, sem Teams e sem WhatsApp.
- 1 dia presencial: sem compromissos depois das 17h.`;

export type Prompt = {
  id: string;
  titulo: string;
  quando: string;
  objetivo: string;
  texto: string;
};

export function montarPrompts(dados: DadosPOS, hoje: string): Prompt[] {
  const semana = semanaAtual(dados.semanas, hoje);
  const prioridades = semana?.prioridades ?? "(ainda não definidas)";

  const caixa = dados.tarefas.filter((t) => t.etapa === "Caixa de entrada");
  const listaCaixa = caixa.length
    ? caixa.map((t) => `- ${t.titulo} (origem: ${t.origem ?? "?"}; contexto: ${t.contexto ?? "?"})`).join("\n")
    : "- (caixa de entrada vazia)";

  const abertas = dados.tarefas.filter((t) => t.etapa === "A fazer" || t.etapa === "Fazendo");
  const listaAbertas = abertas
    .map(
      (t) =>
        `- [${t.quadrante ?? "sem quadrante"}] ${t.titulo} · ${t.contexto ?? ""} · ${t.pomodorosEstimados ?? "?"} pomodoros${t.prazo ? ` · prazo ${rotuloDia(t.prazo)}` : ""}`,
    )
    .join("\n");

  const proxSegunda = somarDias(segundaDe(hoje), 7);
  const inicioPlano = hoje.localeCompare(somarDias(segundaDe(hoje), 4)) > 0 ? proxSegunda : segundaDe(hoje);
  const fimPlano = somarDias(inicioPlano, 6);
  const listaCompromissos = dados.compromissos
    .filter((c) => c.tipo === "Reunião" || c.tipo === "Dia presencial" || !c.inegociavel)
    .filter((c) => {
      const d = diaDe(c.inicio);
      return d >= inicioPlano && d <= fimPlano;
    })
    .sort((a, b) => a.inicio.localeCompare(b.inicio))
    .map((c) => `- ${rotuloDia(diaDe(c.inicio))} ${hora(c.inicio)}–${c.fim ? hora(c.fim) : ""} · ${c.titulo} (${c.tipo})`)
    .join("\n");

  const iniRev = segundaDe(somarDias(hoje, -1));
  const fimRev = somarDias(iniRev, 6);
  const naRev = (d: string | null) => Boolean(d && d >= iniRev && d <= fimRev);
  const tarefasRev = dados.tarefas
    .filter((t) => naRev(t.concluidaEm) || t.etapa === "A fazer" || t.etapa === "Fazendo" || t.etapa === "Descartada")
    .map((t) => `- ${t.titulo} · ${t.quadrante ?? "sem quadrante"} · ${t.etapa}${t.concluidaEm ? ` em ${rotuloDia(t.concluidaEm)}` : ""}`)
    .join("\n");
  const sessoesRev = dados.sessoes.filter((s) => naRev(diaDe(s.inicio)));
  const porDia = new Map<string, { ok: number; interrompidas: number }>();
  for (const s of sessoesRev) {
    const d = diaDe(s.inicio);
    const v = porDia.get(d) ?? { ok: 0, interrompidas: 0 };
    if (s.concluida) v.ok++;
    else v.interrompidas++;
    porDia.set(d, v);
  }
  const listaSessoes = [...porDia.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([d, v]) => `- ${rotuloDia(d)}: ${v.ok} concluídos, ${v.interrompidas} interrompidos`)
    .join("\n");
  const listaCheckins = dados.checkins
    .filter((c) => naRev(c.data))
    .sort((a, b) => a.data.localeCompare(b.data))
    .map(
      (c) =>
        `- ${rotuloDia(c.data)}: energia ${c.energia ?? "?"}/5, ${c.humor ?? ""}, treino ${c.treino ? "sim" : "não"}, refeições ${c.refeicoes ? "sim" : "não"}, desconectei ${c.desconectei ? "sim" : "não"}, ${c.interrupcoes ?? "?"} interrupções. Vitória: ${c.vitoria ?? "-"}`,
    )
    .join("\n");

  return [
    {
      id: "triagem",
      titulo: "1. Triagem da caixa de entrada",
      quando: "Todo dia útil, às 11h, depois da primeira checagem de e-mail, Teams e WhatsApp.",
      objetivo: "Transformar o que chegou em ações claras e classificá-las na Matriz de Eisenhower.",
      texto: `Você é minha assistente de organização. ${PERFIL}

Para cada item abaixo, responda em uma tabela com as colunas:
Tarefa (reescrita como ação concreta, começando com verbo) | Urgente (sim/não) | Importante (sim/não) | Quadrante (Q1 Fazer agora, Q2 Agendar, Q3 Delegar, Q4 Eliminar) | Pomodoros estimados | Justificativa em 1 frase.

Critérios:
- Importante = contribui para as 3 prioridades da semana, para a equipe ou para minha saúde.
- Urgente = tem consequência real se não for feito em até 48h (não é a pressa de quem pediu).
- Se for Q3, sugira a quem delegar (função, não nome) e a mensagem de delegação em 2 linhas.
- Se um item for grande demais (mais de 4 pomodoros), quebre em subtarefas.

Prioridades da semana:
${prioridades}

Itens:
${listaCaixa}`,
    },
    {
      id: "planejamento",
      titulo: "2. Planejamento semanal",
      quando: "Domingo, 19h, depois da revisão.",
      objetivo: "Encaixar as tarefas nos horários livres sem invadir treino, refeições, faculdade e descanso.",
      texto: `Monte meu plano da semana de ${rotuloDia(inicioPlano)} a ${rotuloDia(fimPlano)}. ${PERFIL}

${REGRAS_FIXAS}

O que eu quero de volta:
1. Uma proposta de "Foco da semana" em 1 frase e 3 prioridades.
2. Uma tabela dia a dia com as tarefas encaixadas nos blocos livres, em pomodoros (25 min).
3. Alertas: dias com mais de 4h de reunião, tarefas Q2 que estão sendo adiadas há mais de 1 semana e prazos da faculdade que exigem começar já.
4. No máximo 12 pomodoros de trabalho por dia útil. Se não couber, diga o que deve sair.

Tarefas abertas:
${listaAbertas || "- (nenhuma)"}

Compromissos (reuniões e eventos que não são blocos fixos):
${listaCompromissos || "- (nenhum cadastrado ainda)"}`,
    },
    {
      id: "revisao",
      titulo: "3. Revisão semanal",
      quando: "Domingo, antes do planejamento.",
      objetivo: "Olhar os dados da semana com gentileza e escolher um único ajuste.",
      texto: `Faça a revisão da minha semana (${rotuloDia(iniRev)} a ${rotuloDia(fimRev)}) com base nos dados abaixo. Seja objetiva e gentil, sem cobrança.

1. Números: tarefas concluídas, pomodoros, energia média, dias em que desconectei no horário.
2. O que funcionou (até 3 pontos, com evidência nos dados).
3. Padrão de risco: onde minha energia caiu e o que aconteceu naquele dia.
4. Tarefas que não foram feitas: por quê, provavelmente, e se devem continuar, ser delegadas ou sair.
5. Um único ajuste para a próxima semana.

Tarefas:
${tarefasRev || "- (nenhuma)"}

Sessões de foco por dia:
${listaSessoes || "- (nenhuma)"}

Check-ins diários:
${listaCheckins || "- (nenhum)"}`,
    },
    {
      id: "comunicacao",
      titulo: "4. Comunicação: resposta clara",
      quando: "Antes de responder uma mensagem difícil ou longa, ou quando o \"sim\" automático vai custar a noite.",
      objetivo: "Responder com clareza, negociar prazos e delegar sem ruído.",
      texto: `Reescreva a resposta abaixo para [canal: e-mail / Teams / WhatsApp], em tom cordial e direto.
- Comece pelo que a pessoa precisa saber.
- Se eu não puder atender no prazo pedido, proponha um prazo realista e explique em 1 frase.
- Se couber delegar, indique quem vai acompanhar (função, não nome).
- Máximo de 5 linhas.

Mensagem recebida: [colar, sem nomes nem dados sigilosos]
O que eu quero responder: [rascunho ou ideia]`,
    },
    {
      id: "fatiar",
      titulo: "5. Anti-procrastinação: fatiar o trabalho do mês",
      quando: "No dia em que a faculdade publica o trabalho do mês.",
      objetivo: "Evitar a última hora quebrando o trabalho grande em entregas pequenas com data.",
      texto: `Este é o enunciado do trabalho da faculdade. O prazo é [data].
Quebre em entregas de no máximo 2 pomodoros, em ordem, e distribua nas minhas noites de estudo (segunda a quinta, 19h30–21h) e no sábado à tarde, terminando 2 dias antes do prazo.
Para cada entrega, diga o critério de "pronto".

Enunciado: [colar]`,
    },
  ];
}
