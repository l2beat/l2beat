import type { UpgradeabilityParameters } from '@l2beat/discovery-types'
import { EthereumAddress } from '@l2beat/shared-pure'

import { ScalingProjectReference } from './ScalingProjectReference'
import { ScalingProjectRisk } from './ScalingProjectRisk'

export interface ScalingProjectContracts {
  /** List of the contracts */
  addresses: ScalingProjectContract[]
  /** List of risks associated with the contracts */
  risks: ScalingProjectRisk[]
  /** List of references backing up the claim */
  references?: ScalingProjectReference[]
  /** The description and research is incomplete */
  isIncomplete?: boolean
  /** The description and research is under review */
  isUnderReview?: boolean
}

export type ScalingProjectContract =
  | ScalingProjectContractSingleAddress
  | ScalingProjectContractMultipleAddresses

export interface ScalingProjectContractSingleAddress {
  /** Address of the contract */
  address: EthereumAddress
  /** Name of the chain of this address. Optional for backwards compatibility */
  chain?: string
  /** Solidity name of the contract */
  name: string
  /** Description of the contract's role in the system */
  description?: string
  /** Details about upgradeability */
  upgradeability?: ScalingProjectUpgradeability
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
  references?: ScalingProjectReference[]
}

export function isSingleAddress(
  c: ScalingProjectContract,
): c is ScalingProjectContractSingleAddress {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return (c as ScalingProjectContractSingleAddress).address !== undefined
}

export interface ScalingProjectContractMultipleAddresses {
  /** Address of the contract */
  multipleAddresses: EthereumAddress[]
  /** Solidity name of the contract */
  name: string
  /** Description of the contract's role in the system */
  description?: string
  /** Url to chain's etherscan */
  etherscanUrl?: string
  /** Name of the chain of this address. Optional for backwards compatibility */
  chain?: string
}

export type ScalingProjectUpgradeability =
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
