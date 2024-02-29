import { ContractMeta, DiscoveryMeta } from '@l2beat/discovery'

import { normalizeDiffPath } from './normalizeDiffPath'

export function getContractMeta(meta: DiscoveryMeta | undefined, name: string) {
  return meta?.contracts.find((c) => c.name === name)
}

export function getValueMeta(
  contractMeta: ContractMeta | undefined,
  name: string | undefined,
) {
  return name !== undefined
    ? contractMeta?.values[normalizeDiffPath(name)]
    : undefined
}
