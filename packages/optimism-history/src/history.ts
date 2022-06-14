import { Contract, providers } from 'ethers'

import { NetworkConfig } from './config'
import { EventProcessor } from './EventProcessor'

const ABI = [
  'event AddressSet(string indexed name, address newAddress, address oldAddress)',
]

export async function getHistory(
  provider: providers.Provider,
  networkConfig: NetworkConfig,
  eventProcessor: EventProcessor,
) {
  const addressManager = new Contract(
    networkConfig.addressManager,
    ABI,
    provider,
  )
  const filter = addressManager.filters.AddressSet()
  const events = await addressManager.queryFilter(
    filter,
    networkConfig.fromBlock,
  )

  const processed = await Promise.all(
    events.map((e) => eventProcessor.processEvent(e)),
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
      event.implementationName,
    )
  }
}
