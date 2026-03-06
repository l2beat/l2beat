// Compiled Review types — mirrors ReviewCompiler.ts from backend

export interface CompiledReview {
  version: '1.0'
  compiledAt: string
  project: string

  metadata: {
    protocolName: string
    protocolSlug: string
    chain: string
    projectType: string
    tokenName: string
    description: string
  }

  totals: {
    contractCount: number
    permissionedFunctionCount: number
    scoredFunctionCount: number
    adminCount: number
    dependencyCount: number
    totalCapitalAtRisk: number
    totalTokenValueAtRisk: number
    totalTokenValue: number
  }

  admins: CompiledAdmin[]
  dependencies: CompiledDependency[]
  funds: CompiledFundHolder[]
  functions: CompiledFunction[]
  contracts: CompiledContract[]

  sections: Record<string, unknown>
}

export interface CompiledAdmin {
  address: string
  name: string
  description: string
  adminType: string
  isGovernance: boolean
  functions: CompiledAdminFunction[]
  totalDirectCapital: number
  totalDirectTokenValue: number
  totalReachableCapital: number
  totalReachableTokenValue: number
}

export interface CompiledAdminFunction {
  contractAddress: string
  contractName: string
  functionName: string
  impact: 'critical'
  directFundsUsd: number
  directTokenValueUsd: number
  reachableContracts: CompiledReachableContract[]
}

export interface CompiledReachableContract {
  address: string
  name: string
  viewOnlyPath: boolean
  calledFunctions: string[]
  fundsUsd: number
  tokenValueUsd: number
  fundsAtRisk: boolean
}

export interface CompiledDependency {
  address: string
  name: string
  description: string
  entity: string | null
  isAutoDetected: boolean
  viewOnlyPath: boolean
  calledFunctions: string[]
  functions: {
    contractAddress: string
    contractName: string
    functionName: string
    viewOnlyPath: boolean
  }[]
}

export interface CompiledFundHolder {
  address: string
  name: string
  description: string
  balances: { totalUsdValue: number } | null
  positions: { totalUsdValue: number } | null
  tokenInfo: {
    symbol: string
    price: number
    totalSupply: string
    tokenValue: number
  } | null
}

export interface CompiledFunction {
  contractAddress: string
  contractName: string
  functionName: string
  impact: 'critical'
}

export interface CompiledContract {
  address: string
  name: string
  isExternal: boolean
  isGovernance: boolean
  entity: string | null
  proxyType: string | null
}

// Index types — produced by compile-data.ts

export interface IndexData {
  totalDefiTvl: number
  protocols: ProtocolSummary[]
  globalTotals: {
    totalCapitalAtRisk: number
    totalTokenValueAtRisk: number
    totalTokenValue: number
    protocolsReviewed: number
  }
  dependencies: AggregatedDependency[]
}

export interface ProtocolSummary {
  slug: string
  name: string
  chain: string
  projectType: string
  tokenName: string
  totals: CompiledReview['totals']
}

export interface AggregatedDependency {
  address: string
  name: string
  entity: string | null
  totalFundsAtRisk: number
  protocols: { slug: string; name: string }[]
}
