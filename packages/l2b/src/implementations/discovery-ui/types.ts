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
  chain: string
  initialContracts: ApiProjectContract[]
  discoveredContracts: ApiProjectContract[]
  ignoredContracts: ApiAddressEntry[]
  eoas: ApiAddressEntry[]
}

export interface ApiAddressEntry {
  name?: string
  chain: string
  address: string
}

export interface ApiProjectContract {
  name?: string
  chain: string
  address: string
  values: Record<string, string>
}
