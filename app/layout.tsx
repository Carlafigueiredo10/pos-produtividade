import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import Link from "next/link";
import { Menu } from "@/components/Menu";
import { IconeBussola } from "@/components/Icones";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["600"],
});

const plex = IBM_Plex_Sans({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "POS · Sistema Operacional Pessoal",
  description:
    "Sistema Operacional Pessoal para organizar tempo, comunicação e produtividade com Notion, Pomodoro, Matriz de Eisenhower e IA.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${plex.variable}`}>
      <body>
        <div className="app">
          <aside className="lateral">
            <Link href="/" className="lateral-marca">
              <IconeBussola className="marca-icone" />
              <strong>POS</strong>
            </Link>
            <span className="lateral-rotulo">Espaço de trabalho</span>
            <Menu />
            <p className="lateral-regra">
              Regra do sistema: tudo que chega vai para a caixa de entrada antes de virar compromisso.
            </p>
          </aside>
          <div className="conteudo">
            <div className="faixa" aria-hidden />
            {children}
            <footer className="rodape">
              Trabalho acadêmico · Produtividade e Gestão do Tempo · UniFECAF · Dados de exemplo, sem informações reais de órgão público.
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
