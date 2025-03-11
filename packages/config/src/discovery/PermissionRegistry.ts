import type { EntryParameters } from '@l2beat/discovery'
import type { EthereumAddress } from '@l2beat/shared-pure'

export interface PermissionRegistry {
  getPermissionedContracts(): EthereumAddress[]
  getPermissionedEoas(): EthereumAddress[]
  describePermissions(
    contractOrEoa: EntryParameters,
    includeDirectPermissions: boolean,
  ): string[]
  getUpgradableBy(
    contract: ContractParameters,
  ): { name: string; delay: string }[]
}
