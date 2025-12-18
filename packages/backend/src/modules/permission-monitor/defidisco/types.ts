export interface ResolutionBlob {
  version: string
  resolvedAt: string
  contracts: Record<string, ResolvedContract>
}

export interface ResolvedContract {
  contractName: string
  functions: ResolvedFunction[]
}

export interface ResolvedFunction {
  functionName: string
  ownerResolutions: OwnerResolution[]
  allOwners: string[]
  resolutionErrors: string[]
}

export interface OwnerResolution {
  path: string
  addresses: string[]
  error: string | null
}

export interface PermissionChange {
  contractAddress: string
  contractName: string
  functionName: string
  changes: {
    addedOwners: EnrichedAddress[]
    removedOwners: EnrichedAddress[]
  }
  resolutionErrors: string[]
}

export interface EnrichedAddress {
  address: string
  name: string
}

export interface FunctionsJson {
  version: string
  lastModified: string
  contracts: Record<
    string,
    {
      functions: FunctionEntry[]
    }
  >
}

export interface FunctionEntry {
  functionName: string
  isPermissioned?: boolean
  ownerDefinitions?: OwnerDefinition[]
}

export interface OwnerDefinition {
  path: string
}