import { EthereumAddress } from '@l2beat/shared-pure'

import { ProjectReference } from './ProjectReference'

export interface ProjectPermission {
  accounts: ProjectPermissionedAccount[]
  name: string
  description: string
  // list of source code permalinks and useful materials
  references?: ProjectReference[]
}

export interface ProjectPermissionedAccount {
  address: EthereumAddress
  type: 'EOA' | 'MultiSig' | 'Contract'
}
