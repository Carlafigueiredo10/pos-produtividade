import { connection } from "next/server";
import { Captura } from "@/components/Captura";
import { notionConfigurado } from "@/lib/notion";

export const metadata = { title: "POS · Capturar" };

export default async function Capturar() {
  await connection();
  return (
    <main className="pagina" style={{ maxWidth: 760 }}>
      <div className="cabecalho">
        <span className="sobretitulo">GTD · Etapa 1: capturar</span>
        <h1>Tirar da cabeça</h1>
        <p className="subtitulo">
          Tudo o que chega por e-mail, Teams, WhatsApp ou reunião vem para cá antes de virar compromisso. Nada de
          responder na hora nem de guardar na memória: a decisão acontece na triagem.
        </p>
      </div>
      <Captura demo={!notionConfigurado()} />
    </main>
  );
}
