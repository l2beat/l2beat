import { EthereumAddress } from '@l2beat/shared-pure'

import { ScalingProjectReference } from './ScalingProjectReference'

export interface ScalingProjectPermission {
  /** List of the accounts */
  accounts: ScalingProjectPermissionedAccount[]
  /** Name of this group */
  name: string
  /** Description of the permissions */
  description: string
  /** devId of the chain of this address. Optional for backwards compatibility */
  devId?: string
  /** List of source code permalinks and useful materials */
  references?: ScalingProjectReference[]
}

export interface ScalingProjectPermissionedAccount {
  address: EthereumAddress
  type: 'EOA' | 'MultiSig' | 'Contract'
}
