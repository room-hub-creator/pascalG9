// Efficient binomial coefficient computation using BigInt.
// Uses symmetry C(n, r) = C(n, n - r) and multiplicative formula
// to avoid building the full triangle for very large n.

export function binomial(n: number, r: number): bigint {
  if (r < 0 || r > n) return 0n;
  if (r === 0 || r === n) return 1n;
  // Symmetry: minimize multiplications
  const k = r > n - r ? n - r : r;
  let result = 1n;
  const N = BigInt(n);
  for (let i = 1; i <= k; i++) {
    result = (result * (N - BigInt(i) + 1n)) / BigInt(i);
  }
  return result;
}

// Build only the rows needed (0..maxRow). Each row reuses the previous one.
export function buildPascalRows(maxRow: number): bigint[][] {
  const rows: bigint[][] = [];
  for (let n = 0; n <= maxRow; n++) {
    const row: bigint[] = new Array(n + 1);
    row[0] = 1n;
    row[n] = 1n;
    for (let r = 1; r < n; r++) {
      row[r] = rows[n - 1][r - 1] + rows[n - 1][r];
    }
    rows.push(row);
  }
  return rows;
}

// Format a BigInt with thousands separators.
export function formatBigInt(value: bigint): string {
  return value.toLocaleString("en-US");
}

// Truncate very long numbers for display in tight spaces.
export function truncateNumber(value: bigint, maxLen = 40): string {
  const s = value.toString();
  if (s.length <= maxLen) return s;
  const head = s.slice(0, 12);
  const tail = s.slice(-12);
  return `${head}…${tail} (${s.length} digits)`;
}
