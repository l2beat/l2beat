import chalk from 'chalk'
import { boolean, command, flag, option, positional, string } from 'cmd-ts'
import { writeFileSync } from 'fs'
import { getExplorer } from '../implementations/common/getExplorer'
import { getPlainLogger } from '../implementations/common/getPlainLogger'
import { fetchAndFlatten } from '../implementations/flatten'
import {
  chainName,
  explorerApiKey,
  explorerChainId,
  explorerType,
  explorerUrl,
} from './args'
import { EthereumAddressValue } from './types'

export const Flatten = command({
  name: 'flatten',
  description:
    'Fetches source code from Etherscan and flattens it into a single file.',
  version: '1.0.0',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    chainName,
    explorerUrl,
    explorerType,
    explorerApiKey,
    explorerChainId,
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
    const logger = getPlainLogger()
    const client = getExplorer(args)
    const flat = await fetchAndFlatten(
      args.address,
      client,
      logger,
      args.includeAll,
    )

    console.log(`Done, saving to ${chalk.magenta(args.output)}.`)
    writeFileSync(args.output, flat)
  },
})
