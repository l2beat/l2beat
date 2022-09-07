export interface Layer2Permission {
  accounts: Layer2PermissionedAccount[]
  name: string
  description: string
}

export interface Layer2PermissionedAccount {
  address: string
  type: 'EOA' | 'MultiSig' | 'Contract'
}
