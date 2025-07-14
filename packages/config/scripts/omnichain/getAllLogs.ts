import type { providers } from 'ethers'

export interface LogFilter {
  address: string
  topics: string[]
  fromBlock: number
  toBlock: number
}

export async function getAllLogs(
  provider: providers.JsonRpcProvider,
  filter: LogFilter,
): Promise<providers.Log[]> {
  if (filter.fromBlock === filter.toBlock) {
    return await provider.getLogs(filter)
  }
  try {
    return await provider.getLogs(filter)
  } catch (e) {
    if (
      e instanceof Error &&
      e.message.includes('Log response size exceeded')
    ) {
      const midPoint =
        filter.fromBlock + Math.floor((filter.toBlock - filter.fromBlock) / 2)
      const [a, b] = await Promise.all([
        getAllLogs(provider, {
          ...filter,
          fromBlock: filter.fromBlock,
          toBlock: midPoint,
        }),
        getAllLogs(provider, {
          ...filter,
          fromBlock: midPoint + 1,
          toBlock: filter.toBlock,
        }),
      ])
      return a.concat(b)
    }
    throw e
  }
}
