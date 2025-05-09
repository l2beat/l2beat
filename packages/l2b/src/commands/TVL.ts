import { formatLargeNumber } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { command, flag, positional } from 'cmd-ts'
import { estimateTVL } from '../implementations/estimateTVL'
import { EthereumAddressValue, HttpUrl } from './types'

export const TVL = command({
  name: 'tvl',
  description: 'Approximates the TVL of an account.',
  version: '1.0.0',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    rpcUrl: positional({ type: HttpUrl, displayName: 'rpcUrl' }),
    breakdownByToken: flag({
      description: 'Show breakdown of TVL by token.',
      long: 'breakdown',
      short: 'b',
      defaultValue: () => false,
    }),
  },
  handler: async (args) => {
    const usdValue = await estimateTVL(args.rpcUrl, args.address)
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

        console.log(`${formattedSymbol} ${formattedValue}`)
      }
    }

    const totalValue =
      usdValue.reduce((acc, { value }) => acc + Number(value), 0) / 100

    console.log(
      `Estimated TVL: ${chalk.green(`$${formatLargeNumber(totalValue)}`)}`,
    )
  },
})
