import type { ContractParameters, EoaParameters } from '@l2beat/discovery'

export interface PermissionRegistry {
  getPermissionedContracts(): ContractParameters[]
  getPermissionedEoas(): EoaParameters[]
  describePermissions(
    contractOrEoa: ContractParameters | EoaParameters,
    includeDirectPermissions: boolean,
  ): string[]
}
