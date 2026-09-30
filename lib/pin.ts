import "server-only";
import { timingSafeEqual } from "node:crypto";

/** Escritas no Notion exigem o PIN definido em POS_PIN (o site é público). */
export function pinValido(request: Request) {
  const esperado = process.env.POS_PIN;
  const recebido = request.headers.get("x-pos-pin") ?? "";
  if (!esperado) return false;
  const a = Buffer.from(esperado);
  const b = Buffer.from(recebido);
  return a.length === b.length && timingSafeEqual(a, b);
}
