import type { providers } from 'ethers'

export async function getBlockNumberTwoProviders(
  p1: providers.JsonRpcProvider,
  p2: providers.JsonRpcProvider,
): Promise<number> {
  if (p1 === p2) {
    return p1.getBlockNumber()
  }
  return Math.min(
    ...(await Promise.all([p1.getBlockNumber(), p2.getBlockNumber()])),
  )
}
