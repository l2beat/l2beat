export function getLastDayRatio(uops: number, txs: number) {
  if (uops === 0 || txs === 0) {
    return 1
  }

  return uops / txs
}
