// Efficient binomial coefficient computation using BigInt.

export function binomial(n: number, r: number): bigint {
  if (r < 0 || r > n) return 0n;
  if (r === 0 || r === n) return 1n;
  const k = r > n - r ? n - r : r;
  let result = 1n;
  const N = BigInt(n);
  for (let i = 1; i <= k; i++) {
    result = (result * (N - BigInt(i) + 1n)) / BigInt(i);
  }
  return result;
}

// Build only rows 0..maxRow (each row from previous).
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

export function formatBigInt(value: bigint): string {
  return value.toLocaleString("en-US");
}

export function shortBigInt(value: bigint, head = 8, tail = 8): string {
  const s = value.toString();
  if (s.length <= head + tail + 3) return s;
  return `${s.slice(0, head)}…${s.slice(-tail)}`;
}

// Expansion of (a + b)^n: returns terms with coefficient and exponents.
export function expandBinomial(n: number): Array<{ coef: bigint; aExp: number; bExp: number }> {
  const terms = [];
  for (let r = 0; r <= n; r++) {
    terms.push({ coef: binomial(n, r), aExp: n - r, bExp: r });
  }
  return terms;
}
