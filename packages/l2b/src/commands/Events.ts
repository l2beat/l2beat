import { CliLogger } from '@l2beat/shared'
import { command, positional, restPositionals, string } from 'cmd-ts'
import { getEvents } from '../implementations/events'
import { explorerApiKey, explorerType, explorerUrl, rpcUrl } from './args'
import { EthereumAddressValue } from './types'

export const Events = command({
  name: 'events',
  description: 'Fetches all events matching a given address and topics.',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    topics: restPositionals({ type: string, displayName: 'address' }),
    rpcUrl,
    explorerUrl,
    type: explorerType,
    apiKey: explorerApiKey,
  },
  handler: async (args) => {
    const logger = new CliLogger()
    await getEvents(
      logger,
      args.address,
      args.topics,
      args.rpcUrl,
      args.explorerUrl,
      args.apiKey,
      args.type,
    )
  },
})
