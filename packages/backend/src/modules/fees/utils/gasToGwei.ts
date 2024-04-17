export function gasToGwei(gas: bigint | null | undefined): number {
  return parseFloat((Number(gas) * 1e-9).toFixed(9))
}

export function gweiToEth(gwei: number): number {
  return gwei * 1e-9
}
