import { EthereumAddress } from '@l2beat/shared'

export interface ProjectPermission {
  accounts: ProjectPermissionedAccount[]
  name: string
  description: string
}

export interface ProjectPermissionedAccount {
  address: EthereumAddress
  type: 'EOA' | 'MultiSig' | 'Contract'
}
