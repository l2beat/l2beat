import { EthereumAddress } from '@l2beat/shared-pure'

import { ScalingProjectReference } from './ScalingProjectReference'

export interface ScalingProjectPermission {
  accounts: ScalingProjectPermissionedAccount[]
  name: string
  description: string
  etherscanUrl?: string
  // list of source code permalinks and useful materials
  references?: ScalingProjectReference[]
}

export interface ScalingProjectPermissionedAccount {
  address: EthereumAddress
  type: 'EOA' | 'MultiSig' | 'Contract'
}
