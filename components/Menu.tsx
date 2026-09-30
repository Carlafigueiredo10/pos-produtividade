"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconeBrilho, IconeBussola, IconeCaixa, IconeMapa, IconeTimer } from "./Icones";

const ITENS = [
  { href: "/", rotulo: "Painel", Icone: IconeBussola },
  { href: "/foco", rotulo: "Foco (Pomodoro)", Icone: IconeTimer },
  { href: "/capturar", rotulo: "Capturar", Icone: IconeCaixa },
  { href: "/ia", rotulo: "Prompts do Claude", Icone: IconeBrilho },
  { href: "/como-funciona", rotulo: "Como funciona", Icone: IconeMapa },
];

export function Menu() {
  const atual = usePathname();
  return (
    <nav className="menu" aria-label="Seções">
      {ITENS.map(({ href, rotulo, Icone }) => (
        <Link key={href} href={href} aria-current={atual === href ? "page" : undefined}>
          <Icone />
          {rotulo}
        </Link>
      ))}
    </nav>
  );
}
