import { getChainConfig } from '@l2beat/discovery'
import { command, positional, restPositionals, string } from 'cmd-ts'
import { getProvider } from '../implementations/common/GetProvider'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
import {
  getDebugTraces,
  getMintTransactions,
  traverseTraces,
} from '../implementations/minters/getMinters'
import { EthereumAddressValue } from './types'

export const Minters = command({
  name: 'minters',
  description:
    'Find token minters based on event transfers and traces - returns list of msg.senders who called given function.',
  args: {
    chain: positional({
      displayName: 'chain',
    }),
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    signatures: restPositionals({
      type: string,
      displayName: 'additional signatures you want to search for (optional)',
    }),
  },
  handler: async (args) => {
    const logger = getPlainLogger()
    const chain = getChainConfig(args.chain)

    const provider = await getProvider(chain.rpcUrl, chain.explorer)
    Object.assign(provider, { chain: args.chain })

    logger.info('Getting mint transactions...')
    const transactions = await getMintTransactions(provider, args.address)
    logger.info(`Done. Got ${transactions.length} transactions`)

    logger.info('Getting debug traces...')
    let counter = 0
    const onFetch = (txHash: string) => {
      counter++
      logger.info(
        `Fetched trace for ${txHash} [${counter}/${transactions.length}] `,
      )
    }
    const traces = await getDebugTraces(provider, transactions, onFetch)
    logger.info(`Done. Got ${traces.length} traces`)

    logger.info('Traversing traces...')
    const minters = traverseTraces(traces)
    logger.info(`Done. Got ${minters.length} minters`)

    logger.info('Minters:')
    for (const minter of minters) {
      logger.info(`• ${minter}`)
    }
  },
})
