// Make sure it follows packages/protocolbeat/src/discovery-ui/api/types.ts

export type ApiProjectsResponse = ApiProjectEntry[]

export interface ApiProjectEntry {
  name: string
  chains: string[]
}

export interface ApiProjectResponse {
  chains: ApiProjectChain[]
}

export interface ApiProjectChain {
  name: string
  initialContracts: ApiProjectContract[]
  discoveredContracts: ApiProjectContract[]
  ignoredContracts: ApiAddressEntry[]
  eoas: ApiAddressEntry[]
}

export interface ApiAddressEntry {
  name?: string
  type:
    | 'EOA'
    | 'Unverified'
    | 'Token'
    | 'Multisig'
    | 'Diamond'
    | 'Timelock'
    | 'Contract'
  address: string
}

export interface Field {
  name: string
  value: FieldValue
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

export interface AddressFieldValue {
  type: 'address'
  name?: string
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

export interface ApiProjectContract extends ApiAddressEntry {
  fields: Field[]
}
