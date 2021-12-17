import { Contract, providers } from 'ethers'

import { NetworkConfig } from './config'
import { EtherscanApi } from './EtherscanApi'
import { getBlockTimestamp } from './getBlockTimestamp'
import { getContractName } from './getContractName'
import { getOptimismName } from './getOptimismName'

const ABI = [
  'event AddressSet(string indexed name, address newAddress, address oldAddress)',
]

export async function getHistory(
  provider: providers.Provider,
  etherscanApi: EtherscanApi,
  networkConfig: NetworkConfig
) {
  const addressManager = new Contract(
    networkConfig.addressManager,
    ABI,
    provider
  )
  const filter = addressManager.filters.AddressSet()
  const events = await addressManager.queryFilter(
    filter,
    networkConfig.fromBlock
  )

  const processed = await Promise.all(
    events.map(async (e) => ({
      blockNumber: e.blockNumber,
      transactionHash: e.transactionHash,
      nameHash: e.args?.name.hash as string,
      oldAddress: e.args?.oldAddress as string,
      newAddress: e.args?.newAddress as string,
      timestamp: await getBlockTimestamp(provider, e.blockNumber),
      name: await getOptimismName(
        provider,
        e.args?.name.hash,
        e.transactionHash
      ),
      implementationName: await getContractName(
        etherscanApi,
        e.args?.newAddress
      ),
    }))
  )

  processed.sort((a, b) => a.blockNumber - b.blockNumber)

  for (const event of processed) {
    const time = new Date(event.timestamp * 1000).toISOString().substring(0, 10)
    console.log(
      time,
      ' ',
      event.name.padEnd(42, ' '),
      event.oldAddress,
      '->',
      event.newAddress,
      event.implementationName
    )
  }
}
