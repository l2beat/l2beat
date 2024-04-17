import { UnixTime } from '@l2beat/shared-pure'
import { PublicClient } from 'viem'

export async function getBlockByTimestamp(
  provider: PublicClient,
  timestamp: UnixTime,
): Promise<number> {
  const minBlockNumber = 0
  const maxBlockNumber = Number(await provider.getBlockNumber())

  const blockNumber = bisectToFindClosestBlock(
    provider,
    timestamp,
    minBlockNumber,
    maxBlockNumber,
  )

  return blockNumber
}

async function bisectToFindClosestBlock(
  provider: PublicClient,
  timestamp: UnixTime,
  minBlockNumber: number,
  maxBlockNumber: number,
): Promise<number> {
  if (minBlockNumber === maxBlockNumber) {
    return minBlockNumber
  }

  const midBlockNumber = Math.floor((minBlockNumber + maxBlockNumber) / 2)

  const midTimestamp = new UnixTime(
    Number(
      (
        await provider.getBlock({
          blockNumber: BigInt(midBlockNumber),
        })
      ).timestamp,
    ),
  )

  if (timestamp.lte(midTimestamp)) {
    return bisectToFindClosestBlock(
      provider,
      timestamp,
      minBlockNumber,
      midBlockNumber,
    )
  } else {
    return bisectToFindClosestBlock(
      provider,
      timestamp,
      midBlockNumber + 1,
      maxBlockNumber,
    )
  }
}
