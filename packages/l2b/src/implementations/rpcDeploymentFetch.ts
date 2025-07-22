import { type EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { providers } from 'ethers'

export async function getContractCreationTimestamp(
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
): Promise<UnixTime | undefined> {
  const minBlockNumber = 0
  const maxBlockNumber = await provider.getBlockNumber()

  const code = await provider.getCode(address.toString(), maxBlockNumber)
  if (code === '0x') {
    return undefined
  }

  const creationBlock = bisectToFindCreationBlock(
    provider,
    address,
    minBlockNumber,
    maxBlockNumber,
  )

  const block = await provider.getBlock(creationBlock)
  console.log(block.number)
  return UnixTime(block.timestamp)
}

async function bisectToFindCreationBlock(
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
  minBlockNumber: number,
  maxBlockNumber: number,
): Promise<number> {
  if (minBlockNumber === maxBlockNumber) {
    return minBlockNumber
  }

  const midBlockNumber = Math.floor((minBlockNumber + maxBlockNumber) / 2)

  const code = await provider.getCode(address.toString(), midBlockNumber)

  if (code !== '0x') {
    return bisectToFindCreationBlock(
      provider,
      address,
      minBlockNumber,
      midBlockNumber,
    )
  }
  return bisectToFindCreationBlock(
    provider,
    address,
    midBlockNumber + 1,
    maxBlockNumber,
  )
}
