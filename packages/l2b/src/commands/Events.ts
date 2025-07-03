import { command, positional, restPositionals, string } from 'cmd-ts'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
import { getEvents } from '../implementations/events'
import {
  chainName,
  explorerApiKey,
  explorerChainId,
  explorerType,
  explorerUrl,
  rpcUrl,
} from './args'
import { EthereumAddressValue } from './types'

export const Events = command({
  name: 'events',
  description: 'Fetches all events matching a given address and topics.',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    topics: restPositionals({ type: string, displayName: 'topics' }),
    rpcUrl,
    chainName,
    explorerUrl,
    explorerType,
    explorerApiKey,
    explorerChainId,
  },
  handler: async (args) => {
    const logger = getPlainLogger()
    await getEvents(logger, args)
  },
})
