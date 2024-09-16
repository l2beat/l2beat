import { oneOf, option, optional, string } from 'cmd-ts'
import { ExistingPath, HttpUrl } from './types'

export const discoveryPath = option({
  type: optional(ExistingPath),
  long: 'discovery-path',
  short: 'd',
})

export const rpcUrl = option({
  type: HttpUrl,
  env: 'L2B_RPC_URL',
  long: 'rpc-url',
  short: 'u',
})

export const explorerUrl = option({
  type: HttpUrl,
  long: 'explorer-url',
  short: 'u',
  defaultValue: () => 'https://api.etherscan.io/api',
  defaultValueIsSerializable: true,
})

export const explorerType = option({
  type: oneOf(['etherscan', 'blockscout']),
  long: 'etherscan-type',
  short: 't',
  defaultValue: () => 'etherscan',
})

export const explorerApiKey = option({
  type: optional(string),
  env: 'L2B_ETHERSCAN_API_KEY',
  long: 'etherscan-key',
  short: 'k',
})
