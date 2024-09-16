export function formatTps(tps: number): string {
  const fixed = tps.toFixed(2)
  if (tps !== 0 && fixed === '0.00') {
    return '<0.01'
  }
  return fixed
}

export function formatTpsWithUnit(tps: number): string {
  return `${formatTps(tps)} TPS`
}
