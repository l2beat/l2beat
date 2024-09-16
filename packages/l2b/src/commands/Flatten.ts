import { writeFileSync } from 'fs'
import { HttpClient, flattenStartingFrom } from '@l2beat/discovery'
import {
  ExplorerConfig,
  getExplorerClient,
} from '@l2beat/discovery/dist/utils/IEtherscanClient'
import { assert } from '@l2beat/shared-pure'
import chalk from 'chalk'
import { boolean, command, flag, option, positional, string } from 'cmd-ts'
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
    assert(
      args.type !== 'etherscan' || args.apiKey !== undefined,
      'When using etherscan you should provide the API key using --etherscan-key.',
    )
    const httpClient = new HttpClient()
    const client = getExplorerClient(httpClient, {
      type: args.type as ExplorerConfig['type'],
      url: args.explorerUrl.toString(),
      apiKey: args.apiKey ?? 'YourApiKeyToken',
    })

    console.log('Fetching contract source code...')
    const source = await client.getContractSource(args.address)

    console.log('Flattening...')
    const input = Object.entries(source.files)
      .map(([fileName, content]) => ({
        path: fileName,
        content,
      }))
      .filter((e) => e.path.endsWith('.sol'))

    const output = flattenStartingFrom(source.name, input, source.remappings, {
      includeAll: args.includeAll,
    })
    console.log(`Done, saving to ${chalk.magenta(args.output)}.`)
    writeFileSync(args.output, output)
  },
})
