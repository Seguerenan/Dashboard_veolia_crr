import Papa from "papaparse";

export interface OrdemServicoRow {
  ordem_servico: string;
  descricao: string;
  local: string;
  ativo: string;
  status_codigo: string;
  tipo_servico: string;
  inicio_previsto: string; // YYYY-MM-DD
  termino_efetivo: string; // YYYY-MM-DD
}

const COLUMN_MAP: Record<string, keyof OrdemServicoRow> = {
  "ordem de serviço": "ordem_servico",
  "ordem de servico": "ordem_servico",
  "descrição": "descricao",
  "descricao": "descricao",
  "local": "local",
  "ativo": "ativo",
  "status": "status_codigo",
  "status_codigo": "status_codigo",
  "início previsto": "inicio_previsto",
  "inicio previsto": "inicio_previsto",
  "tipo de serviço": "tipo_servico",
  "tipo de servico": "tipo_servico",
  "término efetivo": "termino_efetivo",
  "termino efetivo": "termino_efetivo",
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

export function parseCSV(file: File): Promise<OrdemServicoRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      encoding: "UTF-8",
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data: OrdemServicoRow[] = [];

          for (const row of results.data as Record<string, string>[]) {
            const mapped: Partial<OrdemServicoRow> = {};

            for (const [rawCol, value] of Object.entries(row)) {
              const col = rawCol.trim();
              // Ignore empty or "Unnamed" columns
              if (!col || col.toLowerCase().startsWith("unnamed") || !value?.trim()) continue;

              const key = COLUMN_MAP[col.toLowerCase()];
              if (!key) continue;

              if (key === "inicio_previsto" || key === "termino_efetivo") {
                (mapped as any)[key] = normalizeDate(value);
              } else {
                (mapped as any)[key] = value.trim();
              }
            }

            if (mapped.ordem_servico && mapped.status_codigo && mapped.tipo_servico) {
              data.push(mapped as OrdemServicoRow);
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
