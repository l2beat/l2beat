import type { EntryParameters } from '@l2beat/discovery'
import type { ChainSpecificAddress } from '@l2beat/shared-pure'

export interface PermissionRegistry {
  getPermissionedContracts(): ChainSpecificAddress[]
  getPermissionedEoas(): ChainSpecificAddress[]
  describePermissions(
    contractOrEoa: EntryParameters,
    includeDirectPermissions: boolean,
  ): string
  getUpgradableBy(contract: EntryParameters): { name: string; delay: string }[]
}
