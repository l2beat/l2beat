// This file is duplicated in protocolbeat and l2b!

export type ApiProjectsResponse = ApiProjectEntry[]

export interface ApiProjectEntry {
  name: string
  chains: string[]
}

export interface ApiProjectResponse {
  chains: ApiProjectChain[]
}

export interface ApiPreviewResponse {
  permissionsPerChain: { chain: string; permissions: ApiPreviewPermissions }[]
  contractsPerChain: { chain: string; contracts: ApiPreviewContract[] }[]
}

export interface ApiPreviewPermissions {
  roles: ApiPreviewPermission[]
  actors: ApiPreviewPermission[]
}

export interface ApiPreviewPermission {
  addresses: AddressFieldValue[]
  name: string
  description: string
  multisigParticipants: AddressFieldValue[] | undefined
}

export interface ApiPreviewContract {
  addresses: AddressFieldValue[]
  name: string
  description: string
}

export interface ApiProjectChain {
  name: string
  initialContracts: ApiProjectContract[]
  discoveredContracts: ApiProjectContract[]
  eoas: ApiAddressEntry[]
}

export type ApiAddressType =
  | 'EOA'
  | 'Unverified'
  | 'Token'
  | 'Multisig'
  | 'Diamond'
  | 'Timelock'
  | 'Contract'
  | 'Unknown'

export interface ApiAddressEntry {
  name?: string
  description?: string
  type: ApiAddressType
  referencedBy: AddressFieldValue[]
  address: string
}

export interface Field {
  name: string
  value: FieldValue
  ignoreInWatchMode?: boolean
  ignoreRelatives?: boolean
  handler?: { type: string } & Record<string, unknown>
  description?: string
  severity?: 'HIGH' | 'MEDIUM' | 'LOW'
}

export type FieldValue =
  | AddressFieldValue
  | HexFieldValue
  | StringFieldValue
  | NumberFieldValue
  | BooleanFieldValue
  | ArrayFieldValue
  | ObjectFieldValue
  | UnknownFieldValue
  | ErrorFieldValue

export interface AddressFieldValue {
  type: 'address'
  name?: string
  addressType: ApiAddressType
  address: string
}

export interface HexFieldValue {
  type: 'hex'
  value: string
}

export interface StringFieldValue {
  type: 'string'
  value: string
}

export interface NumberFieldValue {
  type: 'number'
  value: string
}

export interface BooleanFieldValue {
  type: 'boolean'
  value: boolean
}

export interface ArrayFieldValue {
  type: 'array'
  values: FieldValue[]
}

export interface ObjectFieldValue {
  type: 'object'
  value: Record<string, FieldValue>
}

export interface UnknownFieldValue {
  type: 'unknown'
  value: string
}

export interface ErrorFieldValue {
  type: 'error'
  error: string
}

export interface ApiProjectContract extends ApiAddressEntry {
  template?: string
  fields: Field[]
  abis: ApiAbi[]
}

export interface ApiAbi {
  address: string
  entries: ApiAbiEntry[]
}

export interface ApiAbiEntry {
  value: string
  signature?: string
  topic?: string
}

export interface ApiCodeResponse {
  sources: { name: string; code: string }[]
}
