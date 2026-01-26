/**
 * Shared Types for Escrow Analysis
 */

// Security classification types
export type SecurityCategory =
  | 'rollup-secured'
  | 'issuer-secured'
  | 'third-party-secured'

export type BridgeType = 'canonical' | 'external'

// Name classification (user-facing category from the framework)
export type NameCategory =
  | 'canonical-trust-minimized'    // Canonical messaging + rollup/issuer secured
  | 'canonical-additional-trust'   // Canonical messaging + third-party secured
  | 'external'                     // External messaging (any governance)
  | 'native'                       // Native tokens

// Whether using this bridge adds trust assumptions beyond holding the token
export function hasAdditionalTrust(messaging: BridgeType, category: SecurityCategory): boolean {
  if (messaging === 'canonical') {
    // Canonical: only third-party adds trust (rollup/issuer already trusted)
    return category === 'third-party-secured'
  } else {
    // External: issuer-secured is OK (issuer runs bridge), others add validator trust
    return category !== 'issuer-secured'
  }
}

// Derive the Name category from messaging + governance
export function deriveNameCategory(messaging: BridgeType, category: SecurityCategory): NameCategory {
  if (messaging === 'canonical') {
    if (category === 'third-party-secured') {
      return 'canonical-additional-trust'
    }
    return 'canonical-trust-minimized'
  }
  return 'external'
}

// Escrow configuration
export interface EscrowConfig {
  address: string
  name: string
  bridgeType?: BridgeType
  description?: string
}

// Stack-specific configuration
export interface StackConfig {
  projectId: string
  hostChain: string
  rollupAdmins: string[]
  rollupAdminName: string
  escrows: EscrowConfig[]
  autoDetect: boolean
}

// Native token configuration (tokens minted directly on L2 without L1 escrow)
export interface NativeTokenConfig {
  symbol: string
  name: string
  l2Address: string
  issuer: string
  bridgeProtocol: string
  source: 'native' | 'external'
  description: string
  category: SecurityCategory
  categoryReason: string
}

// Discovery data structures
export interface DiscoveryEntry {
  address: string
  name?: string
  template?: string
  type: string
  proxyType?: string
  values?: Record<string, unknown>
  description?: string
  category?: { name: string; priority: number }
  receivedPermissions?: Array<{
    permission: string
    from: string
    via?: Array<{ address: string; delay?: number }>
  }>
  directlyReceivedPermissions?: Array<{
    permission: string
    from: string
  }>
}

export interface Discovery {
  name: string
  chain?: string
  entries: DiscoveryEntry[]
}

// Token value tracking
export interface TokenValue {
  symbol: string
  valueUsd: number
  amount: number
  issuer: string | null
  source?: BridgeType
}

// Trusted party for risk analysis
export interface TrustedParty {
  name: string
  role: string
  powers: string[]
  riskDescription: string
}

// Escrow analysis result
export interface EscrowAnalysis {
  address: string
  name: string
  category: SecurityCategory
  bridgeType: BridgeType
  nameCategory: NameCategory
  additionalTrust: boolean
  categoryReason: string
  admin: string | null
  adminName: string | null
  isRollupControlled: boolean
  tokens: TokenValue[]
  totalValueUsd: number
  source: BridgeType | null
  description: string | null
  isNativeToken?: boolean
  bridgeProtocol?: string
  trustedParties?: TrustedParty[]
}

// External token analysis (tokens without L1 escrow)
export interface ExternalTokenAnalysis {
  symbol: string
  name: string
  l2Address: string
  valueUsd: number
  amount: number
  bridgeProtocol: string
  issuer: string
  category: SecurityCategory
  nameCategory: NameCategory
  additionalTrust: boolean
  categoryReason: string
  formulaType: string
  trustedParties?: TrustedParty[]
}

// Full escrow report
export interface EscrowReport {
  projectId: string
  timestamp: number
  escrows: EscrowAnalysis[]
  externalTokens: ExternalTokenAnalysis[]
  summary: {
    totalTvl: number
    nativeTvl: number
    // Primary classification by Name category
    byNameCategory: {
      canonicalTrustMinimized: number   // Canonical + rollup/issuer secured
      canonicalAdditionalTrust: number  // Canonical + third-party secured
      external: number                   // All external messaging
    }
    // Additional trust breakdown within External
    externalBreakdown: {
      issuerSecured: number    // External + issuer-secured (no additional trust)
      additionalTrust: number  // External + rollup/third-party (additional trust)
    }
    // Legacy fields for comparison
    canonicalTvl: number
    externalTvl: number
    apiCanonicalTvl: number
    apiExternalTvl: number
  }
  externalTokensSummary: {
    totalCount: number
    totalValue: number
    byProtocol: Record<string, { count: number; value: number }>
    byNameCategory: Record<NameCategory, { count: number; value: number }>
  }
}

// TVS API types
export interface TvsTokenAmount {
  type: string
  chain?: string
  address?: string
  escrowAddress?: string
  decimals?: number
}

export interface TvsTokenFormula {
  type: string
  operator?: string
  arguments?: Array<{
    type: string
    amount?: TvsTokenAmount
    priceId?: string
    arguments?: Array<{ type: string; amount?: TvsTokenAmount }>
  }>
  amount?: TvsTokenAmount
}

export interface TvsToken {
  id: string
  name: string
  symbol: string
  category: string
  source: string
  isAssociated: boolean
  address?: { address: string }
  formula: TvsTokenFormula
  priceUsd: number
  value: number
  valueForProject: number
  amount: number
  isGasToken: boolean
}

export interface TvsApiResponse {
  success: boolean
  data: TvsToken[]
}

// Local TVS config (with bridgedUsing)
export interface TvsJsonTokenConfig {
  id: string
  symbol: string
  name: string
  source: string
  bridgedUsing?: {
    bridges: Array<{
      name: string
      slug?: string
    }>
  }
  amount?: {
    type: string
    address?: string
  }
}

// Multi-chain analysis summary
export interface MultiChainSummary {
  timestamp: number
  totalChains: number
  chainsByStack: Record<string, number>
  totalTvl: number
  tvlByStack: Record<string, number>
  canonicalTvl: number
  externalTvl: number
  nativeTvl: number
  reports: EscrowReport[]
}
