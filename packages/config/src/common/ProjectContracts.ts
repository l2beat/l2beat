import { UpgradeabilityParameters } from '@l2beat/shared'

import { ProjectReference } from './ProjectReference'
import { ProjectRisk } from './ProjectRisk'

export interface ProjectContracts {
  /** List of the contracts */
  addresses: ProjectContract[]
  /** List of risks associated with the contracts */
  risks: ProjectRisk[]
  /** List of references backing up the claim */
  references?: ProjectReference[]
  /** The description and research is incomplete */
  isIncomplete?: boolean
}

export interface ProjectContract {
  /** Address of the contract */
  address: string
  /** Solidity name of the contract */
  name: string
  /** Description of the contract's role in the system */
  description?: string
  /** Details about upgradeability */
  upgradeability?: ProjectUpgradeability
}

export type ProjectUpgradeability =
  | CustomUpgradeability
  | CustomUpgradeabilityWithoutAdmin
  | NutBerryUpgradeability
  | ReferenceUpgradeability
  | BeaconUpgradeability
  | UpgradeabilityParameters

export interface CustomUpgradeability {
  type: 'Custom'
  /** Address of the admin */
  admin: string
  /** Address of the implementation */
  implementation: string
}

export interface CustomUpgradeabilityWithoutAdmin {
  type: 'CustomWithoutAdmin'
  /** Address of the admin */
  implementation: string
}

export interface NutBerryUpgradeability {
  type: 'NutBerry'
  /** Address of the admin */
  admin: string
  /** Address of the implementation */
  implementation: string
}

export interface ReferenceUpgradeability {
  type: 'Reference'
  /** Name of the base contract */
  base: string
  /** Method signature to check */
  method: string
  /** Arguments to the method */
  args?: (string | boolean | number)[]
}

export interface BeaconUpgradeability {
  type: 'Beacon'
  /** Address of the beacon contract */
  beacon: string
  /** Address of the admin of the beacon contract */
  beaconAdmin: string
  /** Address of the implementation */
  implementation: string
}
