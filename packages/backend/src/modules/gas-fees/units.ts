export function gweiToWei(gwei: number): bigint {
  return BigInt(Math.round(gwei * 1e9))
}
