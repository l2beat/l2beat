#!/usr/bin/env node
/**
 * Multi-Chain Escrow Analysis Tool
 *
 * Analyzes escrows for any supported chain (Orbit, OP Stack, etc.)
 *
 * Usage:
 *   # Analyze a specific chain
 *   npx ts-node scripts/escrowAnalysis/analyzeMultiChain.ts arbitrum
 *   npx ts-node scripts/escrowAnalysis/analyzeMultiChain.ts nova
 *   npx ts-node scripts/escrowAnalysis/analyzeMultiChain.ts apechain
 *
 *   # List all supported chains by stack
 *   npx ts-node scripts/escrowAnalysis/analyzeMultiChain.ts --list
 */

import chalk from 'chalk'
import { writeFileSync } from 'fs'
import { join } from 'path'

import {
  buildChainRegistry,
  getChainsByStack,
  printRegistrySummary,
  type ChainInfo,
} from './chains/registry'

import { getOrbitStackConfig, getKnownEscrowAdmin } from './chains/orbitStack'
import { getOpStackConfig, getKnownOpStackEscrowAdmin } from './chains/opStack'

import type {
  BridgeType,
  Discovery,
  DiscoveryEntry,
  EscrowAnalysis,
  EscrowConfig,
  EscrowReport,
  ExternalTokenAnalysis,
  NameCategory,
  SecurityCategory,
  StackConfig,
  TokenValue,
  TrustedParty,
  TvsApiResponse,
  TvsJsonTokenConfig,
  TvsToken,
  TvsTokenFormula,
} from './chains/types'

import { deriveNameCategory, hasAdditionalTrust } from './chains/types'

import { readFileSync, existsSync } from 'fs'

// ===== Utility Functions =====

function normalizeAddress(address: string): string {
  return address.toLowerCase().replace(/^[a-z0-9]+:/, '')
}

function formatUsd(value: number): string {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`
  }
  return `$${value.toFixed(2)}`
}

// ===== Token Issuer Mappings =====

const TOKEN_ISSUERS: Record<string, string> = {
  DAI: 'MakerDAO',
  USDS: 'MakerDAO',
  sUSDS: 'MakerDAO',
  wstETH: 'Lido DAO',
  stETH: 'Lido DAO',
  LPT: 'Livepeer',
  USDC: 'Circle',
  USDT: 'Tether',
  WBTC: 'BitGo',
  cbBTC: 'Coinbase',
  SNX: 'Synthetix',
  sUSD: 'Synthetix',
  EURC: 'Circle',
}

const EXTENDED_TOKEN_ISSUERS: Record<string, string> = {
  ...TOKEN_ISSUERS,
  rsETH: 'Kelp DAO',
  ezETH: 'Renzo',
  ZRO: 'Layer Zero',
  EDU: 'Open Campus',
  ATH: 'Aethir',
  GRT: 'The Graph',
  syrupUSDC: 'Maple Finance',
  clBTC: 'Corn Finance',
  tBTC: 'Threshold',
  frxETH: 'Frax',
  sfrxETH: 'Frax',
  SOL: 'Solana/Wormhole',
  RDNT: 'Radiant',
  XBG: 'XBorg',
  sUSDe: 'Ethena',
  USDe: 'Ethena',
  ETHFI: 'EtherFi',
  weETH: 'EtherFi',
  eETH: 'EtherFi',
  MOR: 'Morpheus',
  USDY: 'Ondo',
  GHO: 'Aave',
  STG: 'Stargate',
  sDAI: 'MakerDAO',
  'USD0++': 'Usual',
  USD0: 'Usual',
  SolvBTC: 'Solv Protocol',
  OP: 'Optimism',
}

// ===== Bridge Security Info =====

const LAYERZERO_TRUSTED_PARTIES: TrustedParty[] = [
  {
    name: 'LayerZero Labs',
    role: 'Protocol Operator',
    powers: ['change default DVNs', 'upgrade MessageLib', 'control endpoint config'],
    riskDescription: 'Can redirect validation to malicious DVNs',
  },
  {
    name: 'LayerZero DVN',
    role: 'Message Validator',
    powers: ['validate cross-chain messages', 'approve minting'],
    riskDescription: 'Can approve fraudulent mints or censor transfers',
  },
]

const BRIDGE_SECURITY_INFO: Record<string, { category: SecurityCategory; trustedParties: TrustedParty[] }> = {
  'Circle CCTP': {
    category: 'issuer-secured',
    trustedParties: [
      {
        name: 'Circle',
        role: 'Token Issuer & Bridge Operator',
        powers: ['mint/burn USDC', 'blacklist addresses', 'pause transfers'],
        riskDescription: 'Full control over USDC',
      },
    ],
  },
  'Layer Zero': {
    category: 'third-party-secured',
    trustedParties: LAYERZERO_TRUSTED_PARTIES,
  },
  'Layer Zero v2': {
    category: 'third-party-secured',
    trustedParties: LAYERZERO_TRUSTED_PARTIES,
  },
  'Wormhole': {
    category: 'third-party-secured',
    trustedParties: [
      {
        name: 'Wormhole Guardians',
        role: 'Message Validator',
        powers: ['validate cross-chain messages', 'approve minting'],
        riskDescription: 'Guardian collusion can approve fraudulent transfers',
      },
    ],
  },
  'Chainlink CCIP': {
    category: 'third-party-secured',
    trustedParties: [
      {
        name: 'Chainlink Node Operators',
        role: 'Message Validator',
        powers: ['validate cross-chain messages'],
        riskDescription: 'Node operator collusion can approve fraudulent transfers',
      },
    ],
  },
  'Axelar': {
    category: 'third-party-secured',
    trustedParties: [
      {
        name: 'Axelar Validators',
        role: 'Message Validator',
        powers: ['validate cross-chain messages'],
        riskDescription: 'Validator collusion can approve fraudulent transfers',
      },
    ],
  },
}

// Bridge protocol to operator mapping (for issuer == bridge operator check)
const BRIDGE_OPERATORS: Record<string, string> = {
  'Layer Zero': 'Layer Zero',
  'Layer Zero v2': 'Layer Zero',
  'Layer Zero v2 OFT': 'Layer Zero',
  'Layer Zero OFT': 'Layer Zero',
  'Frax Ferry': 'Frax',
  'The Graph Custom Gateway': 'The Graph',
  'Wormhole': 'Wormhole',
  'Wormhole NTT': 'Wormhole',
  'Chainlink CCIP': 'Chainlink',
  'Axelar': 'Axelar',
  'Axelar (ITS)': 'Axelar',
  'Connext (xERC20)': 'Connext',
  'Maker Teleport': 'MakerDAO',
  'Sky Teleport': 'MakerDAO',
}

// Known issuer-operated bridges (symbol -> issuer runs bridge)
const ISSUER_OPERATED_TOKENS: Record<string, boolean> = {
  'USDS': true,   // MakerDAO operates their own bridge
  'sUSDS': true,  // MakerDAO operates their own bridge
  'DAI': true,    // MakerDAO Teleport
}

// ===== Data Loading Functions =====

const PROJECTS_DIR = join(__dirname, '../../src/projects')
const TVS_DIR = join(__dirname, '../../src/tvs/json')

function loadDiscovery(projectId: string): Discovery | null {
  const discoveryPath = join(PROJECTS_DIR, projectId, 'discovered.json')
  if (!existsSync(discoveryPath)) return null
  try {
    return JSON.parse(readFileSync(discoveryPath, 'utf-8'))
  } catch {
    return null
  }
}

function loadTvsConfig(projectId: string): Map<string, TvsJsonTokenConfig> {
  const configPath = join(TVS_DIR, `${projectId}.json`)
  const tokenMap = new Map<string, TvsJsonTokenConfig>()

  try {
    const content = readFileSync(configPath, 'utf-8')
    const config = JSON.parse(content) as { tokens: TvsJsonTokenConfig[] }
    for (const token of config.tokens || []) {
      tokenMap.set(token.symbol.toLowerCase(), token)
      if (token.amount?.address) {
        tokenMap.set(token.amount.address.toLowerCase(), token)
      }
    }
  } catch {
    // TVS config not found - not an error
  }

  return tokenMap
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Map project IDs to API IDs (some projects have different names in the API)
const PROJECT_ID_TO_API_ID: Record<string, string> = {
  'optimism': 'op-mainnet',
  'bobanetwork': 'boba-network',
}

function getApiProjectId(projectId: string): string {
  return PROJECT_ID_TO_API_ID[projectId] || projectId
}

async function fetchTvsBreakdown(projectId: string, retries = 3): Promise<TvsToken[]> {
  const apiId = getApiProjectId(projectId)
  const url = `https://l2beat.com/api/scaling/tvs/${apiId}/breakdown`

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(url)

      // Rate limited - wait and retry
      if (response.status === 429 || response.status === 1015) {
        const waitTime = (attempt + 1) * 10000 // 10s, 20s, 30s
        console.log(chalk.yellow(`    Rate limited, waiting ${waitTime / 1000}s...`))
        await sleep(waitTime)
        continue
      }

      if (!response.ok) {
        const text = await response.text()
        if (text.includes('1015') || text.includes('rate')) {
          const waitTime = (attempt + 1) * 10000
          console.log(chalk.yellow(`    Rate limited, waiting ${waitTime / 1000}s...`))
          await sleep(waitTime)
          continue
        }
        return []
      }

      const data = (await response.json()) as TvsApiResponse
      return data.data || []
    } catch {
      if (attempt < retries - 1) {
        await sleep(5000)
        continue
      }
      return []
    }
  }
  return []
}

// Dedupe tokens with same symbol+source (API bug: some tokens like sUSDS appear twice)
// Prefer balanceOfEscrow formula type as it's the direct escrow measurement
function dedupeTokens(tokens: TvsToken[]): TvsToken[] {
  const seen = new Map<string, TvsToken>()
  for (const token of tokens) {
    const key = `${token.symbol}:${token.source}`
    const existing = seen.get(key)
    if (!existing) {
      seen.set(key, token)
    } else if (token.formula.type === 'balanceOfEscrow' && existing.formula.type !== 'balanceOfEscrow') {
      // Prefer balanceOfEscrow over other formula types
      seen.set(key, token)
    }
    // Otherwise keep the first entry
  }
  return Array.from(seen.values())
}

// ===== Analysis Functions =====

function findEntryByAddress(
  discovery: Discovery,
  address: string,
): DiscoveryEntry | undefined {
  const target = normalizeAddress(address)
  return discovery.entries.find((e) => normalizeAddress(e.address) === target)
}

function getAdminFromEntry(entry: DiscoveryEntry): string | null {
  if (entry.values && '$admin' in entry.values) {
    return entry.values['$admin'] as string
  }
  if (entry.values && 'wards' in entry.values) {
    const wards = entry.values['wards'] as string[]
    if (wards && wards.length > 0) {
      return wards[0]
    }
  }
  return null
}

function isRollupControlled(admin: string | null, rollupAdmins: string[]): boolean {
  if (!admin) return false
  return rollupAdmins.some((addr) => normalizeAddress(addr) === normalizeAddress(admin))
}

function extractEscrowAddresses(formula: TvsTokenFormula): string[] {
  const addresses: string[] = []

  function extract(obj: unknown): void {
    if (!obj || typeof obj !== 'object') return
    const record = obj as Record<string, unknown>
    if (record.type === 'balanceOfEscrow' && record.escrowAddress) {
      addresses.push((record.escrowAddress as string).toLowerCase())
    }
    if (record.amount && typeof record.amount === 'object') {
      extract(record.amount)
    }
    if (Array.isArray(record.arguments)) {
      // For diff formulas, only extract from the first argument (the minuend)
      // The second argument is the subtrahend (not a real escrow)
      if (record.type === 'calculation' && record.operator === 'diff') {
        if (record.arguments.length > 0) {
          extract(record.arguments[0])
        }
      } else {
        for (const arg of record.arguments) {
          extract(arg)
        }
      }
    }
  }

  extract(formula)
  return addresses
}

function mapTvsToTokens(escrowAddress: string, tvsData: TvsToken[]): TokenValue[] {
  const normalizedAddress = normalizeAddress(escrowAddress)
  const tokens: TokenValue[] = []

  for (const token of tvsData) {
    const escrowAddresses = extractEscrowAddresses(token.formula)
    if (escrowAddresses.includes(normalizedAddress)) {
      // For sum formulas with multiple escrows, only attribute to the FIRST escrow
      // to avoid confusing duplicate entries with identical values
      const isFirstEscrow = escrowAddresses[0] === normalizedAddress
      if (escrowAddresses.length > 1 && !isFirstEscrow) {
        continue // Skip - value will be attributed to first escrow
      }

      tokens.push({
        symbol: token.symbol,
        valueUsd: token.valueForProject,
        amount: token.amount,
        issuer: EXTENDED_TOKEN_ISSUERS[token.symbol] || null,
        source: token.source as BridgeType,
      })
    }
  }

  tokens.sort((a, b) => b.valueUsd - a.valueUsd)
  return tokens
}

function classifyEscrow(
  escrowConfig: EscrowConfig,
  entry: DiscoveryEntry | undefined,
  discovery: Discovery,
  tokens: TokenValue[],
  stackConfig: StackConfig,
): EscrowAnalysis {
  let admin = entry ? getAdminFromEntry(entry) : null
  // Fallback to known escrow admins if not found in discovery
  if (!admin) {
    admin = getKnownEscrowAdmin(escrowConfig.address) || getKnownOpStackEscrowAdmin(escrowConfig.address)
  }
  const rollupControlled = isRollupControlled(admin, stackConfig.rollupAdmins)

  let category: SecurityCategory
  const bridgeType = escrowConfig.bridgeType ?? 'canonical'
  let categoryReason: string
  let adminName: string | null = null

  if (rollupControlled) {
    category = 'rollup-secured'
    adminName = stackConfig.rollupAdminName
    categoryReason = `Escrow controlled by ${stackConfig.rollupAdminName}`
  } else {
    const tokenIssuers = [...new Set(tokens.map((t) => t.issuer).filter(Boolean))]

    if (tokenIssuers.length === 1) {
      category = 'issuer-secured'
      adminName = tokenIssuers[0]!
      categoryReason = `Escrow controlled by token issuer (${adminName})`
    } else if (tokenIssuers.length === 0) {
      category = 'third-party-secured'
      categoryReason = 'Token issuers unknown'
    } else {
      category = 'third-party-secured'
      categoryReason = 'Escrow holds tokens from multiple issuers'
    }
  }

  // Derive the Name category and additional trust flag
  const nameCategory = deriveNameCategory(bridgeType, category)
  const additionalTrust = hasAdditionalTrust(bridgeType, category)

  return {
    address: escrowConfig.address,
    name: escrowConfig.name,
    category,
    bridgeType,
    nameCategory,
    additionalTrust,
    categoryReason,
    admin,
    adminName,
    isRollupControlled: rollupControlled,
    tokens,
    totalValueUsd: tokens.reduce((sum, t) => sum + t.valueUsd, 0),
    source: bridgeType,
    description: escrowConfig.description ?? null,
  }
}

function getBridgeFromConfig(
  token: TvsToken,
  tvsConfig: Map<string, TvsJsonTokenConfig>,
): string | null {
  const bySymbol = tvsConfig.get(token.symbol.toLowerCase())
  if (bySymbol?.bridgedUsing?.bridges?.[0]?.name) {
    return bySymbol.bridgedUsing.bridges[0].name
  }
  if (token.address?.address) {
    const byAddress = tvsConfig.get(token.address.address.toLowerCase())
    if (byAddress?.bridgedUsing?.bridges?.[0]?.name) {
      return byAddress.bridgedUsing.bridges[0].name
    }
  }
  return null
}

function analyzeExternalTokens(
  tvsData: TvsToken[],
  tvsConfig: Map<string, TvsJsonTokenConfig>,
): ExternalTokenAnalysis[] {
  const results: ExternalTokenAnalysis[] = []

  for (const token of tvsData) {
    if (token.source !== 'external') continue
    if (token.formula.type === 'balanceOfEscrow') continue
    // Skip tokens that have escrow addresses (already counted in escrow analysis)
    const escrowAddresses = extractEscrowAddresses(token.formula)
    if (escrowAddresses.length > 0) continue
    if (token.valueForProject < 100000) continue

    const bridgeFromConfig = getBridgeFromConfig(token, tvsConfig)
    const issuer = EXTENDED_TOKEN_ISSUERS[token.symbol] || 'Unknown'

    let bridgeProtocol: string
    let category: SecurityCategory
    let categoryReason: string
    let trustedParties: TrustedParty[] | undefined

    if (bridgeFromConfig) {
      bridgeProtocol = bridgeFromConfig
      const bridgeInfo = BRIDGE_SECURITY_INFO[bridgeFromConfig]
      if (bridgeInfo) {
        category = bridgeInfo.category
        trustedParties = bridgeInfo.trustedParties
        categoryReason = `Bridged via ${bridgeProtocol}`
      } else {
        category = 'third-party-secured'
        categoryReason = `Bridged via ${bridgeProtocol} (trust model not analyzed)`
      }

      // Check if issuer is the same as bridge operator - if so, it's issuer-secured
      const bridgeOperator = BRIDGE_OPERATORS[bridgeFromConfig]
      const issuerRunsBridge = bridgeOperator && issuer !== 'Unknown' && issuer === bridgeOperator
      // Also check if bridge name contains issuer name (e.g., "Frax Ferry" contains "Frax")
      const bridgeNameContainsIssuer = issuer !== 'Unknown' &&
        bridgeFromConfig.toLowerCase().includes(issuer.toLowerCase().split(' ')[0])
      // Check known issuer-operated tokens
      const knownIssuerOperated = ISSUER_OPERATED_TOKENS[token.symbol] === true

      if (issuerRunsBridge || bridgeNameContainsIssuer || knownIssuerOperated) {
        category = 'issuer-secured'
        categoryReason = `${issuer} operates both the token and the bridge`
        trustedParties = [{
          name: issuer,
          role: 'Token Issuer & Bridge Operator',
          powers: ['mint/burn tokens', 'control bridge'],
          riskDescription: `Full control over ${token.symbol} - no additional trust beyond holding the token`,
        }]
      }
    } else {
      bridgeProtocol = 'Unknown Bridge'
      category = 'third-party-secured'
      categoryReason = 'Unknown bridge protocol'
    }

    // External tokens always use external messaging
    const nameCategory = deriveNameCategory('external', category)
    const additionalTrust = hasAdditionalTrust('external', category)

    results.push({
      symbol: token.symbol,
      name: token.name,
      l2Address: token.address?.address || '',
      valueUsd: token.valueForProject,
      amount: token.amount,
      bridgeProtocol,
      issuer,
      category,
      nameCategory,
      additionalTrust,
      categoryReason,
      formulaType: token.formula.type,
      trustedParties,
    })
  }

  results.sort((a, b) => b.valueUsd - a.valueUsd)
  return results
}

// ===== Main Analysis Function =====

async function analyzeChain(chainInfo: ChainInfo): Promise<EscrowReport | null> {
  const { projectId, stack } = chainInfo

  console.log(chalk.blue(`\nAnalyzing ${projectId} (${stack})...`))

  // Get stack-specific config
  let stackConfig: StackConfig
  if (stack === 'orbit') {
    stackConfig = getOrbitStackConfig(chainInfo)
  } else if (stack === 'opstack') {
    stackConfig = getOpStackConfig(chainInfo)
  } else {
    console.log(chalk.yellow(`  Stack '${stack}' not fully supported yet, using auto-detection`))
    stackConfig = {
      projectId,
      hostChain: chainInfo.hostChain,
      rollupAdmins: [],
      rollupAdminName: 'Rollup Governance',
      escrows: [],
      autoDetect: true,
    }
  }

  // Load discovery
  const discovery = loadDiscovery(projectId)
  if (!discovery) {
    console.log(chalk.yellow(`  No discovery data found for ${projectId}`))
    return null
  }

  // Fetch TVS data
  const tvsDataRaw = await fetchTvsBreakdown(projectId)
  if (tvsDataRaw.length === 0) {
    console.log(chalk.yellow(`  No TVS data found for ${projectId}`))
    return null
  }
  // Dedupe tokens with same symbol+source (API has duplicates like sUSDS)
  const tvsData = dedupeTokens(tvsDataRaw)

  // Note: Use valueForProject (not value) for correct TVL calculations
  // - value: raw escrow balance (wrong for diff formulas)
  // - valueForProject: correctly calculated value after applying formula

  const tvsConfig = loadTvsConfig(projectId)

  // Build escrow configs from TVS if auto-detecting
  let escrowConfigs = stackConfig.escrows
  if (escrowConfigs.length === 0 || stackConfig.autoDetect) {
    // Auto-detect escrows from TVS data
    const escrowsFromTvs = new Map<string, EscrowConfig>()
    for (const token of tvsData) {
      const addresses = extractEscrowAddresses(token.formula)
      for (const addr of addresses) {
        if (escrowsFromTvs.has(addr)) continue
        const entry = findEntryByAddress(discovery, addr)
        escrowsFromTvs.set(addr, {
          address: entry?.address ?? addr,
          name: entry?.name ?? `Escrow ${addr.slice(0, 10)}...`,
          description: entry?.description,
        })
      }
    }
    escrowConfigs = Array.from(escrowsFromTvs.values())
  }

  console.log(chalk.gray(`  Found ${escrowConfigs.length} escrows, ${tvsData.length} tokens`))

  // Analyze escrows
  const escrows: EscrowAnalysis[] = []
  for (const escrowConfig of escrowConfigs) {
    const entry = findEntryByAddress(discovery, escrowConfig.address)
    const tokens = mapTvsToTokens(escrowConfig.address, tvsData)
    const analysis = classifyEscrow(escrowConfig, entry, discovery, tokens, stackConfig)
    escrows.push(analysis)
  }

  // Analyze external tokens
  const externalTokens = analyzeExternalTokens(tvsData, tvsConfig)

  // Calculate summary using valueForProject (correctly calculated values)
  const totalTvl = tvsData.reduce((sum, t) => sum + t.valueForProject, 0)
  const nativeTvl = tvsData.filter((t) => t.source === 'native').reduce((sum, t) => sum + t.valueForProject, 0)

  // Calculate by Name category (the 3 main categories + native)
  const canonicalTrustMinimizedTvl = escrows
    .filter((e) => e.nameCategory === 'canonical-trust-minimized')
    .reduce((sum, e) => sum + e.totalValueUsd, 0)

  const canonicalAdditionalTrustTvl = escrows
    .filter((e) => e.nameCategory === 'canonical-additional-trust')
    .reduce((sum, e) => sum + e.totalValueUsd, 0)

  // External = escrows with external messaging + external tokens (no L1 escrow)
  const externalFromEscrows = escrows
    .filter((e) => e.nameCategory === 'external')
    .reduce((sum, e) => sum + e.totalValueUsd, 0)
  const externalFromTokens = externalTokens.reduce((sum, t) => sum + t.valueUsd, 0)
  const externalTotalTvl = externalFromEscrows + externalFromTokens

  // External breakdown: issuer-secured vs additional trust
  const externalIssuerSecuredTvl = escrows
    .filter((e) => e.nameCategory === 'external' && e.category === 'issuer-secured')
    .reduce((sum, e) => sum + e.totalValueUsd, 0) +
    externalTokens.filter((t) => t.category === 'issuer-secured').reduce((sum, t) => sum + t.valueUsd, 0)

  const externalAdditionalTrustTvl = escrows
    .filter((e) => e.nameCategory === 'external' && e.category !== 'issuer-secured')
    .reduce((sum, e) => sum + e.totalValueUsd, 0) +
    externalTokens.filter((t) => t.category !== 'issuer-secured').reduce((sum, t) => sum + t.valueUsd, 0)

  // Legacy values for comparison with current API
  const canonicalTvl = escrows.filter((e) => e.bridgeType === 'canonical').reduce((sum, e) => sum + e.totalValueUsd, 0)
  const externalTvl = escrows.filter((e) => e.bridgeType === 'external').reduce((sum, e) => sum + e.totalValueUsd, 0) + externalFromTokens
  const apiCanonicalTvl = tvsData.filter((t) => t.source === 'canonical').reduce((sum, t) => sum + t.valueForProject, 0)
  const apiExternalTvl = tvsData.filter((t) => t.source === 'external').reduce((sum, t) => sum + t.valueForProject, 0)

  const report: EscrowReport = {
    projectId,
    timestamp: Date.now(),
    escrows,
    externalTokens,
    summary: {
      totalTvl,
      nativeTvl,
      byNameCategory: {
        canonicalTrustMinimized: canonicalTrustMinimizedTvl,
        canonicalAdditionalTrust: canonicalAdditionalTrustTvl,
        external: externalTotalTvl,
      },
      externalBreakdown: {
        issuerSecured: externalIssuerSecuredTvl,
        additionalTrust: externalAdditionalTrustTvl,
      },
      canonicalTvl,
      externalTvl,
      apiCanonicalTvl,
      apiExternalTvl,
    },
    externalTokensSummary: {
      totalCount: externalTokens.length,
      totalValue: externalFromTokens,
      byProtocol: {},
      byNameCategory: {} as Record<NameCategory, { count: number; value: number }>,
    },
  }

  // Build external tokens summary
  for (const token of externalTokens) {
    if (!report.externalTokensSummary.byProtocol[token.bridgeProtocol]) {
      report.externalTokensSummary.byProtocol[token.bridgeProtocol] = { count: 0, value: 0 }
    }
    report.externalTokensSummary.byProtocol[token.bridgeProtocol].count++
    report.externalTokensSummary.byProtocol[token.bridgeProtocol].value += token.valueUsd

    if (!report.externalTokensSummary.byNameCategory[token.nameCategory]) {
      report.externalTokensSummary.byNameCategory[token.nameCategory] = { count: 0, value: 0 }
    }
    report.externalTokensSummary.byNameCategory[token.nameCategory].count++
    report.externalTokensSummary.byNameCategory[token.nameCategory].value += token.valueUsd
  }

  // Print new framework table (3 categories + native)
  console.log('')
  console.log(chalk.bold('  New Framework Classification'))
  console.log(chalk.gray('  ──────────────────────────────────────────────────────────────────'))

  const canonTrustPct = ((canonicalTrustMinimizedTvl / totalTvl) * 100).toFixed(1)
  console.log(`  ${chalk.green('Canonical (trust-minimized)')}     ${formatUsd(canonicalTrustMinimizedTvl).padStart(12)} (${canonTrustPct.padStart(5)}%)  ${chalk.gray('No additional trust')}`)

  const canonAddTrustPct = ((canonicalAdditionalTrustTvl / totalTvl) * 100).toFixed(1)
  console.log(`  ${chalk.red('Canonical (additional trust)')}    ${formatUsd(canonicalAdditionalTrustTvl).padStart(12)} (${canonAddTrustPct.padStart(5)}%)  ${chalk.gray('Third-party can rug')}`)

  const externalPct = ((externalTotalTvl / totalTvl) * 100).toFixed(1)
  console.log(`  ${chalk.yellow('External')}                        ${formatUsd(externalTotalTvl).padStart(12)} (${externalPct.padStart(5)}%)`)

  // External breakdown
  const extIssuerPct = ((externalIssuerSecuredTvl / totalTvl) * 100).toFixed(1)
  const extAddTrustPct = ((externalAdditionalTrustTvl / totalTvl) * 100).toFixed(1)
  console.log(chalk.gray(`    └─ Issuer-secured (no add. trust)  ${formatUsd(externalIssuerSecuredTvl).padStart(12)} (${extIssuerPct.padStart(5)}%)`))
  console.log(chalk.gray(`    └─ Additional trust                ${formatUsd(externalAdditionalTrustTvl).padStart(12)} (${extAddTrustPct.padStart(5)}%)`))

  const nativePct = ((nativeTvl / totalTvl) * 100).toFixed(1)
  console.log(`  ${chalk.cyan('Native')}                          ${formatUsd(nativeTvl).padStart(12)} (${nativePct.padStart(5)}%)`)

  console.log(chalk.gray('  ──────────────────────────────────────────────────────────────────'))
  console.log(chalk.bold(`  Total                             ${formatUsd(totalTvl).padStart(12)}`))

  // Summary: total with no additional trust
  const noAddTrustTotal = canonicalTrustMinimizedTvl + externalIssuerSecuredTvl + nativeTvl
  const noAddTrustPct = ((noAddTrustTotal / totalTvl) * 100).toFixed(1)
  const addTrustTotal = canonicalAdditionalTrustTvl + externalAdditionalTrustTvl
  const addTrustPct = ((addTrustTotal / totalTvl) * 100).toFixed(1)
  console.log('')
  console.log(chalk.bold('  Trust Summary'))
  console.log(`  ${chalk.green('✓')} No additional trust:    ${formatUsd(noAddTrustTotal).padStart(12)} (${noAddTrustPct.padStart(5)}%)`)
  console.log(`  ${chalk.red('⚠')} Additional trust:       ${formatUsd(addTrustTotal).padStart(12)} (${addTrustPct.padStart(5)}%)`)
  console.log('')

  return report
}

// ===== CLI =====

// List of chains to analyze when no specific chain is provided
const DEFAULT_CHAINS = [
  'arbitrum',
  'nova',
  'apechain',
  'optimism',
  'base',
  'lisk',
  'worldchain',
  'ink',
  'soneium',
  'xchain',
  'polynomial',
]

async function main(): Promise<void> {
  const args = process.argv.slice(2)

  // Parse arguments
  let targetChain: string | undefined
  let listMode = false
  let allMode = false

  for (const arg of args) {
    if (arg === '--list') {
      listMode = true
    } else if (arg === '--all') {
      allMode = true
    } else if (!arg.startsWith('-')) {
      targetChain = arg
    }
  }

  console.log(chalk.bold('\n🔍 Escrow Analysis Tool\n'))

  // Build registry
  const registry = buildChainRegistry()

  if (listMode) {
    printRegistrySummary(registry)
    console.log('\n\nOrbit chains with TVS data:')
    const orbitChains = getChainsByStack(registry, 'orbit').filter((c) => c.hasTvsConfig)
    for (const chain of orbitChains) {
      console.log(`  ${chain.projectId} (${chain.type}, host: ${chain.hostChain})`)
    }
    return
  }

  // Determine which chains to analyze
  const chainsToAnalyze: string[] = targetChain
    ? [targetChain]
    : allMode
      ? DEFAULT_CHAINS
      : DEFAULT_CHAINS // Default: analyze all chains

  for (const chainId of chainsToAnalyze) {
    const chain = registry.get(chainId)
    if (!chain) {
      console.error(chalk.red(`Chain '${chainId}' not found in registry`))
      continue
    }

    // Skip archived chains
    if (chain.isArchived) {
      console.log(chalk.gray(`Skipping ${chainId} (archived)`))
      continue
    }

    // Analyze the chain
    const report = await analyzeChain(chain)

    if (!report) {
      console.log(chalk.yellow(`\nNo report for ${chainId} - check if TVS data is available.`))
      continue
    }

    // Save output
    const outputPath = join(__dirname, 'analysis', `${chainId}.json`)
    writeFileSync(outputPath, JSON.stringify(report, null, 2))
    console.log(chalk.gray(`\nFull report saved to ${outputPath}`))
  }
}

main().catch((error) => {
  console.error(chalk.red('Error:'), error)
  process.exit(1)
})
