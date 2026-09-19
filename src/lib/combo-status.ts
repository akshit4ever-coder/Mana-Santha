export function normalizeComboStatus(value: unknown): string {
  return String(value ?? "").trim().toLowerCase();
}

export function isComboStatusActive(value: unknown): boolean {
  return normalizeComboStatus(value) === "active";
}

export function dateKey(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;

  const raw = String(value).trim();
  const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

export function rangesOverlap(startA: string | null | undefined, endA: string | null | undefined, startB: string | null | undefined, endB: string | null | undefined): boolean {
  const aFrom = dateKey(startA) ?? "0000-01-01";
  const aTo = dateKey(endA) ?? "9999-12-31";
  const bFrom = dateKey(startB) ?? "0000-01-01";
  const bTo = dateKey(endB) ?? "9999-12-31";

  return aFrom <= bTo && bFrom <= aTo;
}

export function isComboVisibleOnDate(combo: { date_valid_from?: string | null; date_valid_to?: string | null }, referenceDate = new Date()): boolean {
  const today = dateKey(referenceDate.toISOString().slice(0, 10)) ?? referenceDate.toISOString().slice(0, 10);
  const from = dateKey(combo?.date_valid_from);
  const to = dateKey(combo?.date_valid_to);

  if (from && from > today) return false;
  if (to && to < today) return false;
  return true;
}

export function isComboCurrentlyValid(combo: { status?: string | null; date_valid_from?: string | null; date_valid_to?: string | null } | null | undefined, referenceDate = new Date()): boolean {
  if (!combo) return false;
  if (!isComboStatusActive(combo.status)) return false;
  return isComboVisibleOnDate(combo, referenceDate);
}

export function getValidActiveCombos(combos: Array<{ status?: string | null; date_valid_from?: string | null; date_valid_to?: string | null }> = [], referenceDate = new Date()) {
  return (combos ?? []).filter((combo) => isComboCurrentlyValid(combo, referenceDate));
}
