import type { Logger } from '@l2beat/backend-tools'
import { codeIsEOA, getChainConfig, type IProvider } from '@l2beat/discovery'
import { assert, ChainSpecificAddress } from '@l2beat/shared-pure'
import { command, positional } from 'cmd-ts'
import { getProvider } from '../implementations/common/GetProvider'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
import {
  fetchAndAnalyze,
  getMintTransactions,
} from '../implementations/minters/getMinters'
import { ChainSpecificAddressValue } from './types'

interface MinterData {
  address: ChainSpecificAddress
  mintTxs: string[]
  isEoa: boolean
  sourceName: string
}

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
    const { logsCount, transactions } = await getMintTransactions(
      provider,
      args.address,
    )
    logger.info('Done. Found:')
    logger.info(` - ${logsCount} events`)
    logger.info(` - ${transactions.length} transactions`)

    if (transactions.length === 0) {
      logger.info('No mint transactions found.')
      return
    }

    logger.info('Processing traces...')
    const minters = await analyzeAll(provider, logger, transactions)

    assert(
      Object.keys(minters).length > 0,
      `No minters found despite ${transactions.length} mint transactions - logic/provider might be flawed`,
    )

    logger.info('')
    logger.info('==========================================')
    logger.info(`Done. Found ${Object.keys(minters).length} minter(s):`)
    for (const minter of Object.values(minters)) {
      logger.info(`• ${minter.address}`)
      logger.info(`  - ${minter.mintTxs.length} mint transactions`)
      logger.info(`  - e.g. ${minter.mintTxs[0] ?? 'error'}`)
      logger.info(
        `  - ${minter.isEoa ? 'EOA' : `Contract (${minter.sourceName})`}`,
      )
    }
  },
})

async function analyzeAll(
  provider: IProvider,
  logger: Logger,
  transactions: string[],
) {
  const minters: Record<ChainSpecificAddress, MinterData> = {}
  let nextPercentToLog = 10

  for (const [index, txHash] of transactions.entries()) {
    const mintersDetected = await fetchAndAnalyze(provider, txHash)

    for (const minter of mintersDetected) {
      if (!minters[minter]) {
        const [byteCode, source] = await Promise.all([
          provider.getBytecode(minter),
          provider.getSource(minter),
        ])
        const isEoa = codeIsEOA(byteCode)
        const sourceName = source.isVerified ? source.name.trim() : 'Unverified'

        logger.info(
          `New minter detected: ${minter} - ${isEoa ? 'EOA' : `Contract (${sourceName})`}`,
        )
        logger.info(` tx: ${txHash}`)

        minters[minter] = {
          address: minter,
          mintTxs: [txHash],
          isEoa,
          sourceName,
        }
      } else {
        minters[minter].mintTxs.push(txHash)
      }
    }

    const percent = Math.floor(((index + 1) / transactions.length) * 100)
    if (percent >= nextPercentToLog) {
      logger.info(`Processed ${percent}% of traces`)
      nextPercentToLog += 10
    }
  }

  return minters
}
