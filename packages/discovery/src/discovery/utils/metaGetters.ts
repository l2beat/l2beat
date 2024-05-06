import { ContractMeta, DiscoveryMeta, ValueMeta } from '../config/DiscoveryMeta'
import { normalizeDiffPath } from './normalizeDiffPath'

export function getContractMeta(
  meta: DiscoveryMeta | undefined,
  name: string,
): ContractMeta | undefined {
  return meta?.contracts.find((c) => c.name === name)
}

export function getValueMeta(
  contractMeta: ContractMeta | undefined,
  name: string | undefined,
): ValueMeta | undefined {
  return name !== undefined
    ? contractMeta?.values[normalizeDiffPath(name)]
    : undefined
}
