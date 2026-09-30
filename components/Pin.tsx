"use client";

import { useEffect, useState } from "react";

const CHAVE = "pos-pin";

/** PIN guardado só neste navegador, enviado no cabeçalho das escritas. */
export function usePin() {
  const [pin, setPinState] = useState("");
  useEffect(() => {
    try {
      setPinState(localStorage.getItem(CHAVE) ?? "");
    } catch {}
  }, []);
  const setPin = (v: string) => {
    setPinState(v);
    try {
      localStorage.setItem(CHAVE, v);
    } catch {}
  };
  return [pin, setPin] as const;
}

export function CampoPin({ pin, setPin, demo }: { pin: string; setPin: (v: string) => void; demo: boolean }) {
  if (demo) return null;
  return (
    <div className="campo" style={{ maxWidth: 220 }}>
      <label htmlFor="pin">PIN para gravar no Notion</label>
      <input id="pin" type="password" inputMode="numeric" autoComplete="off" value={pin} onChange={(e) => setPin(e.target.value)} />
    </div>
  );
}
