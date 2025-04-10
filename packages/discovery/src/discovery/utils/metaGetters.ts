import type {
  StructureContract,
  StructureContractField,
} from '../config/StructureConfig'
import { normalizeDiffPath } from './normalizeDiffPath'

export function getContractField(
  contract: StructureContract | undefined,
  field: string | undefined,
): StructureContractField | undefined {
  return field === undefined
    ? undefined
    : contract?.fields?.[normalizeDiffPath(field)]
}
