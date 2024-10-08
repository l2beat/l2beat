import { writeFileSync } from 'fs'
import { CliLogger } from '@l2beat/shared'
import chalk from 'chalk'
import { boolean, command, flag, option, positional, string } from 'cmd-ts'
import { fetchAndFlatten } from '../implementations/flatten'
import { explorerApiKey, explorerType, explorerUrl } from './args'
import { EthereumAddressValue } from './types'

export const Flatten = command({
  name: 'flatten',
  description:
    'Fetches source code from Etherscan and flattens it into a single file.',
  version: '1.0.0',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    explorerUrl,
    type: explorerType,
    apiKey: explorerApiKey,
    output: option({
      type: string,
      long: 'output',
      short: 'o',
      defaultValue: () => 'output.sol',
    }),
    includeAll: flag({
      type: boolean,
      long: 'include-all',
      short: 'a',
      defaultValue: () => true,
    }),
  },
  handler: async (args) => {
    const logger: CliLogger = new CliLogger()
    const flat = await fetchAndFlatten(
      args.address,
      args.explorerUrl,
      args.apiKey,
      args.type,
      logger,
      args.includeAll,
    )

    console.log(`Done, saving to ${chalk.magenta(args.output)}.`)
    writeFileSync(args.output, flat)
  },
})
