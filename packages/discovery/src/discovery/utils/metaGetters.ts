import type {
  DiscoveryContract,
  DiscoveryContractField,
} from '../config/RawDiscoveryConfig'
import { normalizeDiffPath } from './normalizeDiffPath'

export function getContractField(
  contract: DiscoveryContract | undefined,
  field: string | undefined,
): DiscoveryContractField | undefined {
  return field === undefined
    ? undefined
    : contract?.fields?.[normalizeDiffPath(field)]
}
