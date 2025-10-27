// This file is duplicated in protocolbeat and l2b!

export type ApiProjectsResponse = ApiProjectEntry[]

export interface ApiProjectEntry {
  name: string
  addresses: string[]
  contractNames: string[]
}

export interface ApiProjectResponse {
  entries: ApiProjectChain[]
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
  upgradableBy: UpgradeabilityActor[] | undefined
}

export interface ApiProjectChain {
  project: string
  initialContracts: ApiProjectContract[]
  discoveredContracts: ApiProjectContract[]
  eoas: ApiAddressEntry[]
  blockNumbers: Record<string, number>
}

export type ApiListTemplatesResponse = string[]

export interface ApiTemplateFileResponse {
  template: string
  shapes?: string
  criteria?: string
}

export interface ApiConfigFileResponse {
  config: string
}

export type ApiCreateShapeResponse =
  | {
      success: true
    }
  | {
      success: false
      error: string
    }

export type ApiCreateConfigFileResponse =
  | {
      success: true
    }
  | {
      success: false
      error: string
    }

export type ApiAddressType =
  | 'EOA'
  | 'EOAPermissioned'
  | 'Unverified'
  | 'Token'
  | 'Multisig'
  | 'Diamond'
  | 'Timelock'
  | 'Untemplatized'
  | 'Contract'
  | 'Unknown'

export interface ApiAddressEntry {
  name?: string
  description?: string
  roles: string[]
  type: ApiAddressType
  referencedBy: ApiAddressReference[]
  address: string
  chain: string
  isReachable: boolean
}

export interface ApiAddressReference extends AddressFieldValue {
  fieldNames: string[]
}

export interface Field {
  name: string
  value: FieldValue
  ignoreInWatchMode?: boolean
  ignoreRelatives?: boolean
  handler?: { type: string } & Record<string, unknown>
  description?: string
  severity?: 'HIGH' | 'LOW'
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
  values: [FieldValue, FieldValue][]
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
  template?: {
    id: string
    shape?: {
      name: string
      hasCriteria: boolean
    }
  }
  proxyType?: string
  fields: Field[]
  abis: ApiAbi[]
  implementationNames?: Record<string, string>
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
  entryName: string | undefined
  sources: { name: string; code: string }[]
}

export interface ApiCodeSearchResponse {
  matches: {
    name: string | undefined
    address: string
    codeLocation: {
      line: string
      fileName: string
      index: number
      offset: number
    }[]
  }[]
}

export interface UpgradeabilityActor {
  name: string
  delay: string
}
