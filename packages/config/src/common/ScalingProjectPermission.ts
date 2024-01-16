import { ChainId, EthereumAddress } from '@l2beat/shared-pure'

import { ScalingProjectReference } from './ScalingProjectReference'

export interface ScalingProjectPermission {
  /** List of the accounts */
  accounts: ScalingProjectPermissionedAccount[]
  /** Name of this group */
  name: string
  /** Description of the permissions */
  description: string
  /** Chain id of this address. Optional for backwards compatibility */
  chainId?: ChainId
  /** List of source code permalinks and useful materials */
  references?: ScalingProjectReference[]
}

export interface ScalingProjectPermissionedAccount {
  address: EthereumAddress
  type: 'EOA' | 'MultiSig' | 'Contract'
}
