const KEY = "pascal_history_v1";
const MAX = 30;

export interface HistoryItem {
  n: number;
  r: number;
  value: string; // BigInt as string
  at: number;
}

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as HistoryItem[]) : [];
  } catch {
    return [];
  }
}

export function addHistory(item: HistoryItem) {
  try {
    const list = getHistory();
    // dedupe consecutive same n,r
    if (list[0]?.n === item.n && list[0]?.r === item.r) return;
    const next = [item, ...list].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
