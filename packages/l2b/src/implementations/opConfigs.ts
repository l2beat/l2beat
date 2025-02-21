import type { providers } from 'ethers'
import { z } from 'zod'

export async function getGenesisTimestamp(
  provider: providers.JsonRpcProvider,
): Promise<number> {
  return (await provider.getBlock(0)).timestamp
}

export async function getBlockTime(
  provider: providers.JsonRpcProvider,
): Promise<number> {
  const blocksToFetch = 10
  const newestBlockNumber = await provider.getBlockNumber()
  const blockTimes = []

  const blocks = await Promise.all(
    Array.from({ length: blocksToFetch }, (_, i) =>
      provider.getBlock(newestBlockNumber - i),
    ),
  )

  for (let i = 0; i < blocksToFetch - 1; i++) {
    blockTimes.push(blocks[i].timestamp - blocks[i + 1].timestamp)
  }

  const uniqueBlockTimes = [...new Set(blockTimes)]
  if (uniqueBlockTimes.length > 1) {
    throw new Error('Block times are not constant')
  }
  return uniqueBlockTimes[0]
}

export async function decodeChainId(chainId: number): Promise<string> {
  const response = await fetch('https://chainid.network/chains.json')
  const content = await response.json()
  const chains = ChainIDResponse.parse(content)

  const entry = chains.find((c) => c.chainId === chainId)
  if (entry !== undefined) {
    return entry.name
  } else {
    return chainId.toString()
  }
}

const ChainIDResponse = z.array(
  z.object({
    name: z.string(),
    chainId: z.number(),
  }),
)
