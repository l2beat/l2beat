import { EthereumAddress, UpgradeabilityParameters } from '@l2beat/shared-pure'

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
  /** The description and research is under review */
  isUnderReview?: boolean
}

export type ProjectContract =
  | ProjectContractSingleAddress
  | ProjectContractMultipleAddresses

export interface ProjectContractSingleAddress {
  /** Address of the contract */
  address: EthereumAddress
  /** Solidity name of the contract */
  name: string
  /** Description of the contract's role in the system */
  description?: string
  /** Details about upgradeability */
  upgradeability?: ProjectUpgradeability
  /** Upgrade delay. Can be simple "21 days" or more complex "8 days shortened to 0 by security council" */
  upgradeDelay?: string
  /** Which actors from permissions can upgrade */
  upgradableBy?: string[]
  /** Other considerations worth mentioning about the upgrade process */
  upgradeConsiderations?: string
  /** Pasuable contract */
  pausable?: {
    /** Is it paused? **/
    paused: boolean
    /** Who can pause/unpause the contract */
    pausableBy: string[]
  }
  /** List of references */
  references?: ProjectReference[]
}

export function isSingleAddress(
  c: ProjectContract,
): c is ProjectContractSingleAddress {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (c as ProjectContractSingleAddress).address !== undefined
}

export interface ProjectContractMultipleAddresses {
  /** Address of the contract */
  multipleAddresses: EthereumAddress[]
  /** Solidity name of the contract */
  name: string
  /** Description of the contract's role in the system */
  description?: string
}

export type ProjectUpgradeability =
  | CustomUpgradeability
  | CustomUpgradeabilityWithoutAdmin
  | ReferenceUpgradeability
  | BeaconUpgradeability
  | UpgradeabilityParameters

export interface CustomUpgradeability {
  type: 'Custom'
  /** Address of the admin */
  admin: EthereumAddress
  /** Address of the implementation */
  implementation: EthereumAddress
}

export interface CustomUpgradeabilityWithoutAdmin {
  type: 'CustomWithoutAdmin'
  /** Address of the admin */
  implementation: EthereumAddress
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
  beacon: EthereumAddress
  /** Address of the admin of the beacon contract */
  beaconAdmin: EthereumAddress
  /** Address of the implementation */
  implementation: EthereumAddress
}
