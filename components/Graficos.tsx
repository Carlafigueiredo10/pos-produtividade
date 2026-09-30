"use client";

import { useState } from "react";

type Ponto = { rotulo: string; valor: number };

const ALTURA = 180;
const MARGEM = { topo: 16, dir: 12, base: 28, esq: 28 };

function Tooltip({ x, y, titulo, valor }: { x: number; y: number; titulo: string; valor: string }) {
  return (
    <div className="tooltip" style={{ left: `${x}%`, top: `${(y / ALTURA) * 100}%` }} role="status">
      <span className="tooltip-titulo">{titulo}</span>
      <strong>{valor}</strong>
    </div>
  );
}

function escala(max: number) {
  const topo = Math.max(1, Math.ceil(max));
  const passo = topo <= 5 ? 1 : Math.ceil(topo / 4);
  const marcas: number[] = [];
  for (let v = 0; v <= topo; v += passo) marcas.push(v);
  return { topo: marcas[marcas.length - 1], marcas };
}

/** Colunas verticais (uma série). */
export function Colunas({ dados, unidade, largura = 560 }: { dados: Ponto[]; unidade: string; largura?: number }) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const { topo, marcas } = escala(Math.max(...dados.map((d) => d.valor), 1));
  const areaL = largura - MARGEM.esq - MARGEM.dir;
  const areaA = ALTURA - MARGEM.topo - MARGEM.base;
  const passo = areaL / dados.length;
  const barra = Math.min(28, passo * 0.6);
  const y = (v: number) => MARGEM.topo + areaA - (v / topo) * areaA;

  return (
    <div className="grafico" onMouseLeave={() => setAtivo(null)}>
      <svg viewBox={`0 0 ${largura} ${ALTURA}`} role="img" aria-label={`Gráfico de colunas: ${unidade} por dia`}>
        {marcas.map((m) => (
          <g key={m}>
            <line x1={MARGEM.esq} x2={largura - MARGEM.dir} y1={y(m)} y2={y(m)} className="grade" />
            <text x={MARGEM.esq - 6} y={y(m) + 4} className="eixo" textAnchor="end">{m}</text>
          </g>
        ))}
        {dados.map((d, i) => {
          const cx = MARGEM.esq + passo * i + passo / 2;
          const h = y(0) - y(d.valor);
          return (
            <g key={d.rotulo}>
              {d.valor > 0 && (
                <path
                  className={`marca ${ativo === i ? "ativa" : ""}`}
                  d={`M${cx - barra / 2},${y(0)} v${-(h - 4)} q0,-4 4,-4 h${barra - 8} q4,0 4,4 v${h - 4} z`}
                />
              )}
              {i % 2 === dados.length % 2 || dados.length <= 7 ? (
                <text x={cx} y={ALTURA - 8} className="eixo" textAnchor="middle">{d.rotulo.split(" ")[1]}</text>
              ) : null}
              <rect
                x={cx - passo / 2}
                y={MARGEM.topo}
                width={passo}
                height={areaA}
                fill="transparent"
                onMouseEnter={() => setAtivo(i)}
                onFocus={() => setAtivo(i)}
                tabIndex={0}
                aria-label={`${d.rotulo}: ${d.valor} ${unidade}`}
              />
            </g>
          );
        })}
      </svg>
      {ativo !== null && (
        <Tooltip
          x={((MARGEM.esq + passo * ativo + passo / 2) / largura) * 100}
          y={y(dados[ativo].valor)}
          titulo={dados[ativo].rotulo}
          valor={`${dados[ativo].valor} ${unidade}`}
        />
      )}
    </div>
  );
}

/** Linha com marcadores (uma série), escala fixa 1–5 para energia. */
export function Linha({ dados, min = 1, max = 5, unidade, largura = 560 }: { dados: Ponto[]; min?: number; max?: number; unidade: string; largura?: number }) {
  const [ativo, setAtivo] = useState<number | null>(null);
  const areaL = largura - MARGEM.esq - MARGEM.dir;
  const areaA = ALTURA - MARGEM.topo - MARGEM.base;
  const x = (i: number) => MARGEM.esq + (dados.length <= 1 ? areaL / 2 : (areaL * i) / (dados.length - 1));
  const y = (v: number) => MARGEM.topo + areaA - ((v - min) / (max - min)) * areaA;
  const marcas = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const caminho = dados.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.valor)}`).join(" ");

  if (!dados.length) return <p className="vazio">Sem check-ins ainda.</p>;

  return (
    <div className="grafico" onMouseLeave={() => setAtivo(null)}>
      <svg viewBox={`0 0 ${largura} ${ALTURA}`} role="img" aria-label={`Gráfico de linha: ${unidade} por dia`}>
        {marcas.map((m) => (
          <g key={m}>
            <line x1={MARGEM.esq} x2={largura - MARGEM.dir} y1={y(m)} y2={y(m)} className="grade" />
            <text x={MARGEM.esq - 6} y={y(m) + 4} className="eixo" textAnchor="end">{m}</text>
          </g>
        ))}
        <path d={caminho} className="linha" />
        {ativo !== null && (
          <line x1={x(ativo)} x2={x(ativo)} y1={MARGEM.topo} y2={MARGEM.topo + areaA} className="mira" />
        )}
        {dados.map((d, i) => (
          <g key={d.rotulo}>
            <circle cx={x(i)} cy={y(d.valor)} r={ativo === i ? 6 : 4} className="ponto" />
            <text x={x(i)} y={ALTURA - 8} className="eixo" textAnchor="middle">{d.rotulo.split(" ")[1]}</text>
            <rect
              x={x(i) - areaL / Math.max(dados.length, 1) / 2}
              y={MARGEM.topo}
              width={areaL / Math.max(dados.length, 1)}
              height={areaA}
              fill="transparent"
              onMouseEnter={() => setAtivo(i)}
              onFocus={() => setAtivo(i)}
              tabIndex={0}
              aria-label={`${d.rotulo}: ${unidade} ${d.valor}`}
            />
          </g>
        ))}
      </svg>
      {ativo !== null && (
        <Tooltip
          x={(x(ativo) / largura) * 100}
          y={y(dados[ativo].valor)}
          titulo={dados[ativo].rotulo}
          valor={`${unidade} ${dados[ativo].valor} de ${max}`}
        />
      )}
    </div>
  );
}

/** Barras horizontais com rótulo e valor ao lado (uma série). */
export function Barras({ dados, unidade }: { dados: Ponto[]; unidade: string }) {
  const max = Math.max(...dados.map((d) => d.valor), 1);
  return (
    <ul className="barras" aria-label={`Barras: ${unidade}`}>
      {dados.map((d) => (
        <li key={d.rotulo} title={`${d.rotulo}: ${d.valor} ${unidade}`}>
          <span className="barras-rotulo">{d.rotulo}</span>
          <span className="barras-trilho">
            <span className="barras-valor" style={{ width: `${(d.valor / max) * 100}%` }} />
          </span>
          <span className="barras-num">{d.valor}</span>
        </li>
      ))}
    </ul>
  );
}
