import { connection } from "next/server";
import { Copiar } from "@/components/Copiar";
import { Cabecalho } from "@/components/Cabecalho";
import { IconeBrilho } from "@/components/Icones";
import { carregarDados } from "@/lib/notion";
import { hojeISO } from "@/lib/metricas";
import { montarPrompts } from "@/lib/prompts";

export const metadata = { title: "POS · IA" };

export default async function IA() {
  await connection();
  const dados = await carregarDados();
  const prompts = montarPrompts(dados, hojeISO());

  return (
    <main className="pagina">
      <Cabecalho icone={<IconeBrilho />} titulo="Prompts do Claude">
        O app monta cada prompt já com os dados atuais do Notion. É só copiar, colar no Claude e registrar a resposta
        de volta nas bases. A IA sugere; a decisão é minha.
      </Cabecalho>

      <p className="guia" style={{ display: "block" }}>
        Uso consciente: nada de nomes de pessoas, dados reais do órgão ou informações sigilosas nos prompts. As
        tarefas são descritas de forma genérica.
      </p>

      {prompts.map((p) => (
        <section key={p.id} className="cartao" id={p.id}>
          <div className="cartao-cab">
            <h2>{p.titulo}</h2>
          </div>
          <p className="nota"><strong>Quando:</strong> {p.quando}<br /><strong>Para quê:</strong> {p.objetivo}</p>
          <pre className="prompt">{p.texto}</pre>
          <Copiar texto={p.texto} />
        </section>
      ))}
    </main>
  );
}
