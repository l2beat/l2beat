import { DiscoveryConfig } from '../config/DiscoveryConfig'
import {
  DiscoveryContract,
  DiscoveryContractField,
} from '../config/RawDiscoveryConfig'
import { normalizeDiffPath } from './normalizeDiffPath'

export function getContract(
  config: DiscoveryConfig,
  name: string,
): DiscoveryContract | undefined {
  return config.overrides?.[name ?? '']
}

export function getContractField(
  contract: DiscoveryContract | undefined,
  field: string | undefined,
): DiscoveryContractField | undefined {
  return field === undefined
    ? undefined
    : contract?.fields?.[normalizeDiffPath(field)]
}
