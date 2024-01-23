import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { providers } from 'ethers'

export async function getContractCreationTimestamp(
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
): Promise<UnixTime> {
  const minBlockNumber = 0
  const maxBlockNumber = await provider.getBlockNumber()

  const creationBlock = bisectToFindCreationBlock(
    provider,
    address,
    minBlockNumber,
    maxBlockNumber,
  )

  const block = await provider.getBlock(creationBlock)
  return new UnixTime(block.timestamp)
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
  } else {
    return bisectToFindCreationBlock(
      provider,
      address,
      midBlockNumber + 1,
      maxBlockNumber,
    )
  }
}
