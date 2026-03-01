import Papa from "papaparse";
import type { OrdemServico, StatusCode, TipoServicoCode } from "./types";

const VALID_STATUS: StatusCode[] = ["APPR", "COMP", "INPRG", "WAPPR"];
const VALID_TIPO: TipoServicoCode[] = ["CM", "PM", "PRJ", "OTHER"];

const COLUMN_MAP: Record<string, keyof OrdemServico> = {
  "ordem de serviço": "ordemServico",
  "ordem de servico": "ordemServico",
  "descrição": "descricao",
  "descricao": "descricao",
  "local": "local",
  "ativo": "ativo",
  "status": "status",
  "início previsto": "inicioPrevisto",
  "inicio previsto": "inicioPrevisto",
  "tipo de serviço": "tipoServico",
  "tipo de servico": "tipoServico",
  "término efetivo": "terminoEfetivo",
  "termino efetivo": "terminoEfetivo",
};

function normalizeDate(value: string): string {
  if (!value) return "";
  // Try common date formats
  const cleaned = value.trim().split(" ")[0]; // Remove time part
  // Try DD/MM/YYYY
  const brMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (brMatch) {
    return `${brMatch[3]}-${brMatch[2].padStart(2, "0")}-${brMatch[1].padStart(2, "0")}`;
  }
  // Try YYYY-MM-DD
  const isoMatch = cleaned.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2].padStart(2, "0")}-${isoMatch[3].padStart(2, "0")}`;
  }
  // Try MM/DD/YYYY
  const usMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (usMatch) {
    return `${usMatch[3]}-${usMatch[1].padStart(2, "0")}-${usMatch[2].padStart(2, "0")}`;
  }
  return cleaned;
}

export function parseCSV(file: File): Promise<OrdemServico[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      encoding: "UTF-8",
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data: OrdemServico[] = [];

          for (const row of results.data as Record<string, string>[]) {
            const mapped: Partial<OrdemServico> = {};

            for (const [rawCol, value] of Object.entries(row)) {
              const col = rawCol.trim();
              // Ignore empty or "Unnamed" columns
              if (!col || col.toLowerCase().startsWith("unnamed") || !value?.trim()) continue;

              const key = COLUMN_MAP[col.toLowerCase()];
              if (!key) continue;

              if (key === "inicioPrevisto" || key === "terminoEfetivo") {
                (mapped as any)[key] = normalizeDate(value);
              } else if (key === "status") {
                const upper = value.trim().toUpperCase() as StatusCode;
                if (VALID_STATUS.includes(upper)) mapped.status = upper;
              } else if (key === "tipoServico") {
                const upper = value.trim().toUpperCase() as TipoServicoCode;
                if (VALID_TIPO.includes(upper)) mapped.tipoServico = upper;
              } else {
                (mapped as any)[key] = value.trim();
              }
            }

            if (mapped.ordemServico && mapped.status && mapped.tipoServico) {
              data.push(mapped as OrdemServico);
            }
          }

          resolve(data);
        } catch (e) {
          reject(e);
        }
      },
      error: (err) => reject(err),
    });
  });
}
