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
  type: 'EOA' | 'Multisig' | 'Diamond' | 'Timelock' | 'Contract'
  address: string
}

export interface ApiProjectContract extends ApiAddressEntry {
  values: Record<string, string>
}
