import { writeFileSync } from 'fs'
import { HttpClient, flattenStartingFrom } from '@l2beat/discovery'
import {
  ExplorerConfig,
  getExplorerClient,
} from '@l2beat/discovery/dist/utils/IEtherscanClient'
import chalk from 'chalk'
import {
  boolean,
  command,
  flag,
  oneOf,
  option,
  positional,
  string,
} from 'cmd-ts'
import { EthereumAddressValue, HttpUrl } from './types'

export const Flatten = command({
  name: 'flatten',
  description:
    'Fetches source code from Etherscan and flattens it into a single file.',
  version: '1.0.0',
  args: {
    address: positional({ type: EthereumAddressValue, displayName: 'address' }),
    explorerUrl: option({
      type: HttpUrl,
      long: 'explorer-url',
      short: 'u',
      defaultValue: () => 'https://api.etherscan.io/api',
      defaultValueIsSerializable: true,
    }),
    type: option({
      type: oneOf(['etherscan', 'blockscout']),
      long: 'etherscan-type',
      short: 't',
      defaultValue: () => 'etherscan',
    }),
    apiKey: option({
      type: string,
      env: 'L2B_ETHERSCAN_API_KEY',
      long: 'api-key',
      short: 'k',
      defaultValue: () => 'YourApiKeyToken',
    }),
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
    const httpClient = new HttpClient()
    const client = getExplorerClient(httpClient, {
      type: args.type as ExplorerConfig['type'],
      url: args.explorerUrl.toString(),
      apiKey: args.apiKey,
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
