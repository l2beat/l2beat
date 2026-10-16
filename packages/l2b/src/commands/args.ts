import { number, oneOf, option, optional, string } from 'cmd-ts'
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

export const chainName = option({
  type: optional(string),
  description: 'Chain whose configurations to use for explorer access',
  long: 'explorer-chain-name',
  short: 'c',
})

export const explorerUrl = option({
  type: HttpUrl,
  long: 'explorer-url',
  short: 'u',
  defaultValue: () => 'https://api.etherscan.io/v2/api',
  defaultValueIsSerializable: true,
})

export const explorerType = option({
  type: oneOf(['etherscan', 'blockscout'] as const),
  long: 'etherscan-type',
  short: 't',
  defaultValue: () => 'etherscan' as const,
})

export const explorerChainId = option({
  type: optional(number),
  long: 'explorer-chain-id',
  short: 'i',
  defaultValue: () => 1,
})

export const explorerApiKey = option({
  type: optional(string),
  env: 'L2B_ETHERSCAN_API_KEY',
  long: 'etherscan-key',
  short: 'k',
})
