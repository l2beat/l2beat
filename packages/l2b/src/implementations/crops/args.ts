import {
  ATTESTATION_NETWORK,
  ATTESTATION_NETWORKS,
} from '@l2beat/config/build/crops/eas'
import { boolean, flag, option, optional } from 'cmd-ts'
import { AttestationNetworkValue, HttpUrl } from '../../commands/types'

export const networkOption = option({
  type: AttestationNetworkValue,
  long: 'network',
  description: 'which network the attestations live on.',
  defaultValue: () => ATTESTATION_NETWORKS[ATTESTATION_NETWORK],
})

export const rpcUrlOption = option({
  type: optional(HttpUrl),
  env: 'L2B_CROPS_RPC_URL',
  long: 'rpc-url',
  description: 'defaults to a public rpc for the chosen network.',
})

export const executeFlag = flag({
  type: boolean,
  long: 'execute',
  description: 'send transactions. Needs L2B_CROPS_PRIVATE_KEY.',
})

export const scanFlag = flag({
  type: boolean,
  long: 'scan',
  description:
    'reconcile against every attestation the attester ever made, via eth_getLogs, instead of only the uids in the committed ledger.',
})
