import {
  type MergePolicy,
  mergeRecordByName,
  mergeWithPolicy,
  overrideScalar,
  replaceArray,
} from './mergeUtils'
import type {
  ContractPermission,
  ContractPermissionField,
} from './PermissionConfig'

export function mergePermissionContract(
  base: ContractPermission,
  override: ContractPermission,
): ContractPermission {
  return mergeWithPolicy(permissionContractPolicy, base, override)
}

export const permissionFieldPolicy: MergePolicy<ContractPermissionField> = {
  permissions: replaceArray,
}

const permissionContractPolicy: MergePolicy<ContractPermission> = {
  canActIndependently: overrideScalar,
  fields: mergeRecordByName<ContractPermissionField>((base, override) =>
    mergeWithPolicy(permissionFieldPolicy, base, override),
  ),
}
