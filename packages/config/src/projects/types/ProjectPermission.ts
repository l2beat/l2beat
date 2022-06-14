export interface ProjectPermission {
  accounts: ProjectPermissionedAccount[]
  name: string
  description: string
}

export interface ProjectPermissionedAccount {
  address: string
  type: 'EOA' | 'MultiSig'
}
