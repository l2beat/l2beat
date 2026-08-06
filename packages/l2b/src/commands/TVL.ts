import { getChainConfig } from '@l2beat/discovery'
import { ChainSpecificAddress, formatLargeNumber } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { command, flag, positional } from 'cmd-ts'
import { getProvider } from '../implementations/common/GetProvider'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
import { estimateTVL } from '../implementations/estimateTVL'
import { ChainSpecificAddressValue } from './types'

export const TVL = command({
  name: 'tvl',
  description: 'Approximates the TVL of an account.',
  version: '1.0.0',
  args: {
    address: positional({
      type: ChainSpecificAddressValue,
      displayName: 'address',
      description:
        'Chain-specific account address (e.g. eth:0x123..., arb1:0x456...). See ChainSpecificAddress.ts for valid chain prefixes.',
    }),
    breakdownByToken: flag({
      description: 'Show breakdown of TVL by token.',
      long: 'breakdown',
      short: 'b',
      defaultValue: () => false,
    }),
  },
  handler: async (args) => {
    const logger = getPlainLogger()
    const chainName = ChainSpecificAddress.longChain(args.address)
    const chain = getChainConfig(chainName)
    const provider = await getProvider(chain.rpcUrl, chain.explorer, chainName)

    const usdValue = await estimateTVL(logger, provider, args.address)
    if (!usdValue) return

    if (args.breakdownByToken) {
      const longestSymbol = usdValue.reduce(
        (acc, { symbol }) => Math.max(acc, symbol.length),
        0,
      )
      const sorted = usdValue.sort((a, b) => Number(a.value) - Number(b.value))
      for (const { symbol, value } of sorted) {
        const formattedSymbol = `${symbol}:`.padEnd(longestSymbol + 1)
        const formattedValue = chalk.green(
          `$${formatLargeNumber(Number(value / 100n))}`,
        )

        logger.info(`${formattedSymbol} ${formattedValue}`)
      }
    }

    const totalValue =
      usdValue.reduce((acc, { value }) => acc + Number(value), 0) / 100

    logger.info(
      `Estimated TVL: ${chalk.green(`$${formatLargeNumber(totalValue)}`)}`,
    )
  },
})
