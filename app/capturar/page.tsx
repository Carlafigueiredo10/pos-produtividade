import { connection } from "next/server";
import { Captura } from "@/components/Captura";
import { Cabecalho } from "@/components/Cabecalho";
import { IconeCaixa } from "@/components/Icones";
import { notionConfigurado } from "@/lib/notion";

export const metadata = { title: "POS · Capturar" };

export default async function Capturar() {
  await connection();
  return (
    <main className="pagina estreita">
      <Cabecalho icone={<IconeCaixa />} titulo="Tirar da cabeça">
        Tudo o que chega por e-mail, Teams, WhatsApp ou reunião vem para cá antes de virar compromisso. Nada de
        responder na hora nem de guardar na memória: a decisão acontece na triagem das 11h.
      </Cabecalho>
      <Captura demo={!notionConfigurado()} />
    </main>
  );
}
