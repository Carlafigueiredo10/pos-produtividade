"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITENS = [
  { href: "/", rotulo: "Painel" },
  { href: "/foco", rotulo: "Foco (Pomodoro)" },
  { href: "/capturar", rotulo: "Capturar" },
  { href: "/ia", rotulo: "IA" },
  { href: "/como-funciona", rotulo: "Como funciona" },
];

export function Menu() {
  const atual = usePathname();
  return (
    <nav className="menu" aria-label="Seções">
      {ITENS.map((i) => (
        <Link key={i.href} href={i.href} aria-current={atual === i.href ? "page" : undefined}>
          {i.rotulo}
        </Link>
      ))}
    </nav>
  );
}
