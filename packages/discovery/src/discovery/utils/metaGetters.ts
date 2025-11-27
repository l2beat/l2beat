import type {
  StructureContract,
  StructureContractField,
} from '../config/StructureConfig.js'
import { normalizeDiffPath } from './normalizeDiffPath.js'

export function getContractField(
  contract: StructureContract | undefined,
  field: string | undefined,
): StructureContractField | undefined {
  return field === undefined
    ? undefined
    : contract?.fields?.[normalizeDiffPath(field)]
}
