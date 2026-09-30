import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Menu } from "@/components/Menu";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "POS · Sistema Operacional Pessoal",
  description:
    "Sistema Operacional Pessoal para organizar tempo, comunicação e produtividade com Notion, Pomodoro, Matriz de Eisenhower e IA.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className="topo">
          <div className="topo-interno">
            <Link href="/" className="marca-app">
              🧭 POS <span>Sistema Operacional Pessoal</span>
            </Link>
            <Menu />
          </div>
        </header>
        {children}
        <footer className="rodape">
          Trabalho acadêmico · Produtividade e Gestão do Tempo · UniFECAF · Dados de exemplo, sem informações reais de órgão público.
        </footer>
      </body>
    </html>
  );
}
