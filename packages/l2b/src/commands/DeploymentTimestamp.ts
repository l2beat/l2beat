import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { command, positional, string } from 'cmd-ts'
import { providers } from 'ethers'
import { EthereumAddressValue } from './types'

export const DeploymentTimestamp = command({
  name: 'deployment-timestamp',
  description: 'Gets the timestamp of a contract deployment',
  version: '1.0.0',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    rpcUrl: positional({ type: string, displayName: 'rpcUrl' }),
  },
  handler: async (args) => {
    const provider = new providers.StaticJsonRpcProvider(args.rpcUrl)
    const timestamp = await getContractCreationTimestamp(provider, args.address)
    if (timestamp === undefined) {
      console.log('Contract not found')
      return
    }

    console.log(timestamp.toString())
  },
})

async function getContractCreationTimestamp(
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
