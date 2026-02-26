export function createCaseId(date = new Date()): string {
  const year = date.getUTCFullYear();
  const seed = Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");

  return `CASE-${year}-${seed}`;
}

export function createFlavorHash(caseId: string): string {
  const suffix = Array.from(caseId).reduce((acc, curr) => acc + curr.charCodeAt(0), 0);
  return `hx-${suffix.toString(16)}-${caseId.slice(-4).toLowerCase()}`;
}
