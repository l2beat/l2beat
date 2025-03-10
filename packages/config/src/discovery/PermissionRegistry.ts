import type { ContractParameters, EoaParameters } from '@l2beat/discovery'
import type { EthereumAddress } from '@l2beat/shared-pure'

export interface PermissionRegistry {
  getPermissionedContracts(): EthereumAddress[]
  getPermissionedEoas(): EthereumAddress[]
  describePermissions(
    contractOrEoa: ContractParameters | EoaParameters,
    includeDirectPermissions: boolean,
  ): string[]
}
