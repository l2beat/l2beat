import { writeFileSync } from 'fs'
import path from 'path'
import { HttpClient, flattenStartingFrom } from '@l2beat/discovery'
import {
  ExplorerConfig,
  getExplorerClient,
} from '@l2beat/discovery/dist/utils/IEtherscanClient'
import { assert } from '@l2beat/shared-pure'
import { command, oneOf, option, optional, positional, string } from 'cmd-ts'
import { powerdiff } from '../implementations/powerdiff'
import { DiffingModeType, DisplayModeType, diffContext } from './Powerdiff'
import { EthereumAddressValue, HttpUrl } from './types'

export const FlattenAndDiff = command({
  name: 'flatten-and-diff',
  description:
    'Fetches sources of two contracts from Etherscan, flattens them and runs powerdiff on them.',
  args: {
    leftAddress: positional({
      type: EthereumAddressValue,
      displayName: 'leftAddress',
    }),
    rightAddress: positional({
      type: EthereumAddressValue,
      displayName: 'rightAddress',
    }),
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
      type: optional(string),
      env: 'L2B_ETHERSCAN_API_KEY',
      long: 'api-key',
      short: 'k',
    }),
    difftasticPath: option({
      type: string,
      long: 'difftastic-path',
      defaultValue: () => 'difft',
    }),
    mode: option({
      type: DiffingModeType,
      description:
        'mode in which diff will be generated, either together or split',
      long: 'mode',
      short: 'm',
      defaultValue: () => 'together' as const,
    }),
    displayMode: option({
      type: DisplayModeType,
      description:
        'mode in which diff will be shown, either inline or side-by-side',
      long: 'display-mode',
      short: 'd',
      defaultValue: () => 'inline' as const,
    }),
    diffContext,
  },
  handler: async (args) => {
    assert(
      args.type !== 'etherscan' || args.apiKey !== undefined,
      'When using etherscan you should provide the API key using --api-key.',
    )
    const httpClient = new HttpClient()
    const client = getExplorerClient(httpClient, {
      type: args.type as ExplorerConfig['type'],
      url: args.explorerUrl.toString(),
      apiKey: args.apiKey ?? 'YourApiKeyToken',
    })

    console.log('Fetching contract source code...')
    const leftSource = await client.getContractSource(args.leftAddress)
    const rightSource = await client.getContractSource(args.rightAddress)

    console.log('Flattening...')
    const leftInput = Object.entries(leftSource.files)
      .map(([fileName, content]) => ({
        path: fileName,
        content,
      }))
      .filter((e) => e.path.endsWith('.sol'))

    const rightInput = Object.entries(rightSource.files)
      .map(([fileName, content]) => ({
        path: fileName,
        content,
      }))
      .filter((e) => e.path.endsWith('.sol'))

    const leftOutput = flattenStartingFrom(
      leftSource.name,
      leftInput,
      leftSource.remappings,
    )
    const rightOutput = flattenStartingFrom(
      rightSource.name,
      rightInput,
      rightSource.remappings,
    )

    const leftPath = path.join('/tmp', `${args.leftAddress.toString()}.sol`)
    const rightPath = path.join('/tmp', `${args.rightAddress.toString()}.sol`)

    writeFileSync(leftPath, leftOutput)
    writeFileSync(rightPath, rightOutput)

    console.log(`Done, saving to ${leftPath} & ${rightPath}.`)

    powerdiff(
      leftPath,
      rightPath,
      args.difftasticPath,
      args.mode,
      args.displayMode,
      args.diffContext,
    )
  },
})
