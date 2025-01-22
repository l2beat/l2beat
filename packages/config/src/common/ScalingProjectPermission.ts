import type { EthereumAddress } from '@l2beat/shared-pure'

import type { ScalingProjectReference } from './ScalingProjectReference'

export interface ScalingProjectPermission {
  /** List of the accounts */
  accounts: ScalingProjectPermissionedAccount[]
  /** Name of this group */
  name: string
  /** Description of the permissions */
  description: string
  /** Name of the chain of this address. Optional for backwards compatibility */
  chain?: string
  /** List of source code permalinks and useful materials */
  references?: ScalingProjectReference[]
  /** List of accounts that are participants in this permission, mainly used for MultiSigs */
  participants?: ScalingProjectPermissionedAccount[]
  /** Indicates whether the permission comes from a role like Proposer or Guardian */
  fromRole?: boolean
  /** Indicates whether the generation of contained data was driven by discovery */
  discoveryDrivenData?: boolean
}

export interface ScalingProjectPermissionedAccount {
  address: EthereumAddress
  type: 'EOA' | 'MultiSig' | 'Contract'
}
