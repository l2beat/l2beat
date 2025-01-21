import type { EthereumAddress } from '@l2beat/shared-pure'

import type { ScalingProjectReference } from './ScalingProjectReference'
import type { ScalingProjectRisk } from './ScalingProjectRisk'

export interface ScalingProjectContracts {
  /** List of the contracts on hosted chain */
  addresses: ScalingProjectContract[]
  /** List of risks associated with the contracts */
  risks: ScalingProjectRisk[]
  /** List of the contracts on the chain itself */
  nativeAddresses?: Record<string, ScalingProjectContract[]>
  /** List of references backing up the claim */
  references?: ScalingProjectReference[]
  /** The description and research is incomplete */
  isIncomplete?: boolean
  /** The description and research is under review */
  isUnderReview?: boolean
}

export interface ScalingProjectContract {
  /** Address of the contract */
  address: EthereumAddress
  /** Verification status of the contract */
  isVerified: boolean
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
  /** Indicates whether the generation of contained data was driven by discovery */
  discoveryDrivenData?: boolean
}

export interface ScalingProjectUpgradeability {
  proxyType: string
  immutable?: boolean
  admins: EthereumAddress[]
  implementations: EthereumAddress[]
}
