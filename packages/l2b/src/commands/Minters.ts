import type { Logger } from '@l2beat/backend-tools'
import { getChainConfig, type IProvider } from '@l2beat/discovery'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { command, positional } from 'cmd-ts'
import { getProvider } from '../implementations/common/GetProvider'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
import {
  fetchAndAnalyze,
  getMintTransactions,
} from '../implementations/minters/getMinters'
import { ChainSpecificAddressValue } from './types'

export const Minters = command({
  name: 'minters',
  description:
    'Find token minters based on event transfers and traces - returns list of msg.senders who called given function.',
  args: {
    address: positional({
      type: ChainSpecificAddressValue,
      displayName: 'address',
    }),
  },
  handler: async (args) => {
    const chainName = ChainSpecificAddress.longChain(args.address)
    const logger = getPlainLogger()
    const chain = getChainConfig(chainName)

    const provider = await getProvider(chain.rpcUrl, chain.explorer)
    Object.assign(provider, { chain: chainName })

    logger.info('Getting mint transactions...')
    const transactions = await getMintTransactions(provider, args.address)
    logger.info(`Done. Got ${transactions.length} transactions`)

    if (transactions.length === 0) {
      logger.info('No mint transactions found.')
      return
    }

    logger.info('Processing traces...')
    const minters = await analyzeAll(provider, logger, transactions)

    assert(
      minters.length > 0,
      `No minters found despite ${transactions.length} mint transactions - logic/provider might be flawed`,
    )

    logger.info('')
    logger.info('==========================================')
    logger.info(`Done. Found ${minters.length} minter(s):`)
    for (const minter of minters) {
      logger.info(`• ${minter}`)
    }
  },
})

async function analyzeAll(
  provider: IProvider,
  logger: Logger,
  transactions: string[],
) {
  const minters = new Set<string>()
  let nextPercentToLog = 10

  for (const [index, txHash] of transactions.entries()) {
    const mintersDetected = await fetchAndAnalyze(provider, txHash)

    for (const minter of mintersDetected) {
      if (!minters.has(minter)) {
        logger.info(`New minter detected - ${minter}`)
      }

      minters.add(minter)
    }

    const percent = Math.floor(((index + 1) / transactions.length) * 100)
    if (percent >= nextPercentToLog) {
      logger.info(`Processed ${percent}% of traces`)
      nextPercentToLog += 10
    }
  }

  return [...minters]
}
