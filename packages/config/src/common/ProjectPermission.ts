import { EthereumAddress } from '@l2beat/shared'

export interface ProjectPermission {
  accounts: ProjectPermissionedAccount[]
  name: string
  description: string
  // list of source code permalinks and useful materials
  references?: string[]
}

export interface ProjectPermissionedAccount {
  address: EthereumAddress
  type: 'EOA' | 'MultiSig' | 'Contract'
}
