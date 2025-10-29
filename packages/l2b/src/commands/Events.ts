import { command, positional, restPositionals, string } from 'cmd-ts'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
import { getEvents } from '../implementations/events'
import {
  explorerApiKey,
  explorerChainId,
  explorerType,
  explorerUrl,
  rpcUrl,
} from './args'
import { ChainSpecificAddressValue } from './types'

export const Events = command({
  name: 'events',
  description:
    'Fetches all events matching a given address and topics. Topics can be event signatures (hashes) or event names. Use "null" to skip a topic position when filtering by non-consecutive topics (e.g., topic0 and topic2).',
  args: {
    address: positional({
      type: ChainSpecificAddressValue,
      displayName: 'address',
      description:
        'Chain-specific contract address (e.g., eth:0x123..., arb1:0x456...). See ChainSpecificAddress.ts for valid chain prefixes.',
    }),
    topics: restPositionals({
      type: string,
      displayName: 'topics',
      description:
        'Event topics to filter by. Can be hashes, event names, or "null" to skip a position',
    }),
    rpcUrl,
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
