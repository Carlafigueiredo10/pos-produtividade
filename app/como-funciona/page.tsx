export const metadata = { title: "POS · Como funciona" };

const FLUXO = [
  { passo: "Capturar", quando: "o dia todo", texto: "Tudo o que chega por e-mail, Teams, WhatsApp ou reunião vai para a caixa de entrada (app ou Notion). Nada fica só na memória." },
  { passo: "Triar com IA", quando: "11h", texto: "O Claude sugere o quadrante da Matriz de Eisenhower e estima pomodoros. Eu confirmo e registro a sugestão no Notion." },
  { passo: "Planejar", quando: "domingo 19h", texto: "O Claude monta a semana em cima dos blocos fixos: foco 8h–10h, almoço, treino, faculdade." },
  { passo: "Executar", quando: "blocos de foco", texto: "Pomodoros de 25 min a partir de Q1 e Q2. Cada sessão é gravada no Notion pelo timer." },
  { passo: "Check-in", quando: "fim do dia", texto: "Energia, humor, treino, refeições, desconexão no horário e uma vitória do dia." },
  { passo: "Revisar", quando: "domingo", texto: "O Claude lê os dados da semana e aponta o que funcionou, o padrão de risco e um único ajuste." },
];

const METODOS = [
  { nome: "GTD (Getting Things Done)", uso: "Caixa de entrada única e etapas Caixa de entrada → A fazer → Fazendo → Feito. Resolve o \"conto só com a memória\"." },
  { nome: "Matriz de Eisenhower", uso: "Separa urgente de importante. Q3 é delegado para a equipe, Q4 é descartado sem culpa." },
  { nome: "Pomodoro", uso: "25 min de foco e 5 de pausa, pausa longa a cada 4. Protege contra interrupções e mede o foco real." },
  { nome: "Time blocking", uso: "Blocos fixos e inegociáveis para foco, refeições, treino e faculdade. Demandas novas não invadem esses blocos." },
];

const FERRAMENTAS = [
  { nome: "Notion", papel: "Base de dados do sistema: Tarefas, Planejamento Semanal, Compromissos, Check-in diário e Sessões de foco, com visões de Matriz, Kanban, Agenda e gráficos." },
  { nome: "Claude (chat)", papel: "Triagem, planejamento semanal, revisão, redação de mensagens e fatiamento de trabalhos grandes, com prompts padronizados." },
  { nome: "Este app (Next.js no Vercel)", papel: "Painel de produtividade, timer Pomodoro que grava no Notion, captura rápida e prompts preenchidos com os dados atuais." },
];

export default function ComoFunciona() {
  return (
    <main className="pagina">
      <div className="cabecalho">
        <span className="sobretitulo">Fluxo de organização</span>
        <h1>Como o sistema funciona</h1>
        <p className="subtitulo">
          Um ciclo diário curto e um ritual semanal. O Notion guarda os dados, o Claude ajuda a decidir e este app
          mostra os números e conduz o foco.
        </p>
      </div>

      <section className="cartao">
        <h2>O ciclo</h2>
        <ol className="prioridades">
          {FLUXO.map((f) => (
            <li key={f.passo}>
              <span><strong>{f.passo}</strong> <span className="nota">· {f.quando}</span><br />{f.texto}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="grade-2">
        <div className="cartao">
          <h2>Métodos</h2>
          <ul className="agenda">
            {METODOS.map((m) => (
              <li key={m.nome} style={{ gridTemplateColumns: "1fr" }}>
                <strong>{m.nome}</strong>
                <span className="tipo">{m.uso}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="cartao">
          <h2>Ferramentas</h2>
          <ul className="agenda">
            {FERRAMENTAS.map((f) => (
              <li key={f.nome} style={{ gridTemplateColumns: "1fr" }}>
                <strong>{f.nome}</strong>
                <span className="tipo">{f.papel}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="cartao">
        <h2>Saúde mental como parte do sistema</h2>
        <p>
          Treino e refeições são blocos inegociáveis. O check-in diário registra energia e desconexão no horário, e a
          revisão semanal procura padrões de cansaço antes que virem compromisso perdido. Mensagens de trabalho são
          lidas em 3 horários fixos (11h, 14h e 17h), não o dia inteiro.
        </p>
      </section>
    </main>
  );
}
