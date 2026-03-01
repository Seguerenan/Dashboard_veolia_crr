import type { OrdemServico } from "./types";

const STORAGE_KEY = "os-dashboard-data";

export function saveData(data: OrdemServico[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadData(): OrdemServico[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as OrdemServico[];
  } catch {
    return [];
  }
}

export function clearData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
