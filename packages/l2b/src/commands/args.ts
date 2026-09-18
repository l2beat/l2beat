import { number, oneOf, option, optional, string } from 'cmd-ts'
import {
  ATTESTATION_NETWORK,
  ATTESTATION_NETWORK_NAMES,
} from '../implementations/crops/easConfig'
import { ExistingPath, HttpUrl, ViemAddress, ViemHash } from './types'

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

/** For commands that can fall back to a public rpc of the chosen network. */
export const optionalRpcUrl = option({
  type: optional(HttpUrl),
  env: 'L2B_RPC_URL',
  long: 'rpc-url',
  short: 'u',
  description: 'defaults to a public rpc for the chosen network.',
})

export const attestationNetwork = option({
  type: oneOf(ATTESTATION_NETWORK_NAMES),
  long: 'network',
  description: 'which network the crop attestations live on.',
  defaultValue: () => ATTESTATION_NETWORK,
})

/**
 * Left out, the Safe committed in easConfig for the network is used. A flag
 * rather than a positional so a paste cannot land in the wrong slot.
 */
export const attestationSafe = option({
  type: optional(ViemAddress),
  env: 'L2B_CROPS_SAFE',
  long: 'safe',
  description:
    'the Safe that attests. Defaults to the one committed for the network.',
})

/**
 * The payload carries a timestamp, so calldata generated twice differs. A
 * reviewer reproducing a batch passes the value decoded from it and compares
 * the hex byte for byte.
 */
export const attestationReviewedAt = option({
  type: optional(number),
  long: 'reviewed-at',
  description:
    'unix seconds to stamp the attestation with. Defaults to now; pass the value decoded from an existing batch to reproduce its calldata.',
})

export const attestationTxHash = option({
  type: ViemHash,
  long: 'tx',
  description: 'hash of the executed Safe transaction to record.',
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
