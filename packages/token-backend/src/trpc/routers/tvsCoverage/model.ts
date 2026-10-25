import type { Formula, TvsToken } from '@l2beat/config'
import type {
  AbstractTokenRecord,
  AggregatedInteropDeployedTokenStats,
  DeployedTokenRecord,
  TokenRelationRoute,
} from '@l2beat/database'
import type { InteropBridgeType } from '@l2beat/shared-pure'
import { normalizeInteropTokenAddress } from '../../../ingestion/tokenIngestionUtils'

export interface TvsProjectInput {
  id: string
  name: string
  chain: string | undefined
  plugins: string[]
  tokens: TvsToken[]
}

export interface TokenRef {
  chain: string
  address: string
}

export type CoverageStatus =
  | 'counted'
  | 'countedViaCounterpart'
  | 'scheduled'
  | 'sameAssetOnly'
  | 'missing'

export type CoverageSide = 'chain' | 'escrow'

export type InteropTokenRole =
  | 'locked'
  | 'minted'
  | 'burnAndMint'
  | 'both'
  | 'unknown'

type RelationRole = Exclude<InteropTokenRole, 'both'>

export interface CoverageBridge {
  id: string
  bridgeType: InteropBridgeType
  volumeUsd: number
  transferCount: number
}

export interface CoverageRow extends TokenRef {
  projectId: string
  side: CoverageSide
  symbol: string | undefined
  abstractTokenId: string | undefined
  abstractSymbol: string | undefined
  issuer: string | undefined
  iconUrl: string | undefined
  coingeckoId: string | undefined
  ignored: boolean
  status: CoverageStatus
  countedVia: TokenRef | undefined
  role: InteropTokenRole | undefined
  bridges: CoverageBridge[]
  volumeUsd: number
  transferCount: number
  lastSeen: number
}

interface FormulaLeaf extends TokenRef {
  escrow: boolean
}

interface ProjectIndex {
  project: TvsProjectInput
  plugins: Set<string>
  active: Map<string, FormulaLeaf>
  scheduled: Set<string>
  activeByAbstractToken: Map<string, FormulaLeaf[]>
}

interface RelationEdge {
  plugin: string
  bridgeType: InteropBridgeType
  role: RelationRole
  counterpart: string
}

interface TokenInfo {
  deployedToken: DeployedTokenRecord | undefined
  abstractToken: AbstractTokenRecord | undefined
}

export function normalizeTokenAddress(address: string): string {
  return normalizeInteropTokenAddress(address) ?? address.toLowerCase()
}

export function tokenKey(chain: string, address: string): string {
  return `${chain}:${normalizeTokenAddress(address)}`
}

export function collectActiveLeaves(
  formula: Formula,
  timestamp: number,
): FormulaLeaf[] {
  return collect(formula, timestamp).leaves
}

function collect(
  formula: Formula,
  timestamp: number,
): { active: boolean; leaves: FormulaLeaf[] } {
  switch (formula.type) {
    case 'calculation': {
      const active = formula.arguments
        .map((argument) => collect(argument, timestamp))
        .filter((argument) => argument.active)
      const isActive =
        formula.operator === 'diff' ? active.length >= 2 : active.length >= 1
      return {
        active: isActive,
        leaves: isActive ? active.flatMap((argument) => argument.leaves) : [],
      }
    }
    case 'value':
      return collect(formula.amount, timestamp)
    case 'const':
      return { active: isActiveAt(formula, timestamp), leaves: [] }
    default: {
      const active = isActiveAt(formula, timestamp)
      return {
        active,
        leaves: active ? [toLeaf(formula)] : [],
      }
    }
  }
}

function collectScheduledLeaves(
  formula: Formula,
  timestamp: number,
): FormulaLeaf[] {
  switch (formula.type) {
    case 'calculation':
      return formula.arguments.flatMap((argument) =>
        collectScheduledLeaves(argument, timestamp),
      )
    case 'value':
      return collectScheduledLeaves(formula.amount, timestamp)
    case 'const':
      return []
    default:
      return formula.sinceTimestamp >= timestamp ? [toLeaf(formula)] : []
  }
}

function toLeaf(
  formula: Exclude<Formula, { type: 'calculation' | 'value' | 'const' }>,
): FormulaLeaf {
  return {
    chain: formula.chain,
    address: formula.address,
    escrow:
      formula.type === 'balanceOfEscrow' ||
      formula.type === 'balanceOfEscrows' ||
      formula.type === 'starknetBalanceOf',
  }
}

function isActiveAt(
  formula: { sinceTimestamp: number; untilTimestamp?: number },
  timestamp: number,
) {
  return (
    formula.sinceTimestamp < timestamp &&
    (formula.untilTimestamp === undefined || formula.untilTimestamp > timestamp)
  )
}

export function buildCoverage(input: {
  stats: AggregatedInteropDeployedTokenStats[]
  projects: TvsProjectInput[]
  deployedTokens: DeployedTokenRecord[]
  abstractTokens: AbstractTokenRecord[]
  relations: TokenRelationRoute[]
  timestamp: number
}): CoverageRow[] {
  const tokens = buildTokenInfo(input.deployedTokens, input.abstractTokens)
  const relations = buildRelationIndex(input.relations)
  const indices = input.projects.map((project) =>
    buildProjectIndex(project, tokens, input.timestamp),
  )
  const byChain = new Map(
    indices.flatMap((index) =>
      index.project.chain ? [[index.project.chain, index] as const] : [],
    ),
  )
  const byId = new Map(indices.map((index) => [index.project.id, index]))

  const rows = new Map<string, MutableRow>()
  for (const stat of input.stats) {
    const address = normalizeInteropTokenAddress(stat.tokenAddress)
    if (!address) continue
    const token = { chain: stat.tokenChain, address }

    const chainProject = byChain.get(stat.tokenChain)
    if (chainProject) {
      addStat(rows, chainProject, 'chain', token, stat)
    }

    const bridgeProject = byId.get(stat.id)
    if (
      bridgeProject &&
      bridgeProject !== chainProject &&
      stat.bridgeType === 'lockAndMint' &&
      isLockedByProject(bridgeProject, token, relations)
    ) {
      addStat(rows, bridgeProject, 'escrow', token, stat)
    }
  }

  return Array.from(rows.values(), (row) =>
    finalizeRow(row, tokens, relations),
  ).sort(
    (a, b) =>
      b.volumeUsd - a.volumeUsd ||
      b.transferCount - a.transferCount ||
      a.projectId.localeCompare(b.projectId) ||
      tokenKey(a.chain, a.address).localeCompare(tokenKey(b.chain, b.address)),
  )
}

// The other side of a project's own lock-and-mint bridge is where the project
// escrow sits: Ethereum for an L2, the parent chain for an L3. Relations decide
// when they say which side is locked, e.g. for tokens native to the L2 and
// minted on Ethereum, or for bridges that are not a chain.
function isLockedByProject(
  index: ProjectIndex,
  token: TokenRef,
  relations: Map<string, RelationEdge[]>,
): boolean {
  const roles = (relations.get(tokenKey(token.chain, token.address)) ?? [])
    .filter((edge) => index.plugins.has(edge.plugin))
    .map((edge) => edge.role)
  if (roles.includes('locked')) return true
  if (roles.includes('minted')) return false
  return index.project.chain !== undefined
}

interface MutableRow {
  index: ProjectIndex
  side: CoverageSide
  token: TokenRef
  bridges: Map<string, CoverageBridge>
  lastSeen: number
}

function addStat(
  rows: Map<string, MutableRow>,
  index: ProjectIndex,
  side: CoverageSide,
  token: TokenRef,
  stat: AggregatedInteropDeployedTokenStats,
) {
  const key = `${index.project.id}:${tokenKey(token.chain, token.address)}`
  const row = rows.get(key) ?? {
    index,
    side,
    token,
    bridges: new Map<string, CoverageBridge>(),
    lastSeen: 0,
  }
  const bridgeKey = `${stat.id}:${stat.bridgeType}`
  const bridge = row.bridges.get(bridgeKey) ?? {
    id: stat.id,
    bridgeType: stat.bridgeType,
    volumeUsd: 0,
    transferCount: 0,
  }
  bridge.volumeUsd += stat.volume
  bridge.transferCount += stat.transferCount
  row.bridges.set(bridgeKey, bridge)
  row.lastSeen = Math.max(row.lastSeen, stat.lastSeen)
  rows.set(key, row)
}

function finalizeRow(
  row: MutableRow,
  tokens: Map<string, TokenInfo>,
  relations: Map<string, RelationEdge[]>,
): CoverageRow {
  const key = tokenKey(row.token.chain, row.token.address)
  const { deployedToken, abstractToken } = tokens.get(key) ?? {
    deployedToken: undefined,
    abstractToken: undefined,
  }
  const edges = relations.get(key) ?? []
  const bridges = Array.from(row.bridges.values()).sort(
    (a, b) => b.volumeUsd - a.volumeUsd || a.id.localeCompare(b.id),
  )
  const { status, countedVia } = classify(
    row,
    key,
    abstractToken?.id,
    edges,
    bridges,
  )

  return {
    projectId: row.index.project.id,
    side: row.side,
    chain: row.token.chain,
    address: row.token.address,
    symbol: deployedToken?.symbol ?? abstractToken?.symbol,
    abstractTokenId: abstractToken?.id,
    abstractSymbol: abstractToken?.symbol,
    issuer: abstractToken?.issuer ?? undefined,
    iconUrl: abstractToken?.iconUrl ?? undefined,
    coingeckoId: abstractToken?.coingeckoId ?? undefined,
    ignored: deployedToken?.ignored ?? false,
    status,
    countedVia,
    role: collapseRoles(edges.map((edge) => edge.role)),
    bridges,
    volumeUsd: bridges.reduce((sum, bridge) => sum + bridge.volumeUsd, 0),
    transferCount: bridges.reduce(
      (sum, bridge) => sum + bridge.transferCount,
      0,
    ),
    lastSeen: row.lastSeen,
  }
}

function classify(
  row: MutableRow,
  key: string,
  abstractTokenId: string | undefined,
  edges: RelationEdge[],
  bridges: CoverageBridge[],
): { status: CoverageStatus; countedVia: TokenRef | undefined } {
  const { index } = row
  if (index.active.has(key)) {
    return { status: 'counted', countedVia: undefined }
  }

  // A lock-and-mint copy is backed by its locked counterpart (and the other
  // way round), but only when the project's own bridge moved it: the project
  // escrow does not hold what a third-party bridge locked.
  for (const edge of edges) {
    if (edge.bridgeType !== 'lockAndMint' || edge.role === 'unknown') continue
    if (!index.plugins.has(edge.plugin)) continue
    const counterpart = index.active.get(edge.counterpart)
    if (counterpart) {
      return { status: 'countedViaCounterpart', countedVia: toRef(counterpart) }
    }
  }

  const sameAsset = abstractTokenId
    ? (index.activeByAbstractToken.get(abstractTokenId) ?? [])
    : []
  const movedByOwnBridge = bridges.some(
    (bridge) =>
      bridge.id === index.project.id && bridge.bridgeType === 'lockAndMint',
  )
  if (movedByOwnBridge) {
    const counterpart = sameAsset.find((leaf) =>
      row.side === 'chain'
        ? leaf.chain !== index.project.chain
        : leaf.chain === index.project.chain,
    )
    if (counterpart) {
      return { status: 'countedViaCounterpart', countedVia: toRef(counterpart) }
    }
  }

  if (index.scheduled.has(key)) {
    return { status: 'scheduled', countedVia: undefined }
  }
  if (sameAsset.length > 0) {
    return { status: 'sameAssetOnly', countedVia: undefined }
  }
  return { status: 'missing', countedVia: undefined }
}

function toRef(leaf: FormulaLeaf): TokenRef {
  return { chain: leaf.chain, address: leaf.address }
}

function buildProjectIndex(
  project: TvsProjectInput,
  tokens: Map<string, TokenInfo>,
  timestamp: number,
): ProjectIndex {
  const active = new Map<string, FormulaLeaf>()
  const scheduled = new Set<string>()
  for (const token of project.tokens) {
    for (const leaf of collectActiveLeaves(token.amount, timestamp)) {
      active.set(tokenKey(leaf.chain, leaf.address), leaf)
    }
    for (const leaf of collectScheduledLeaves(token.amount, timestamp)) {
      scheduled.add(tokenKey(leaf.chain, leaf.address))
    }
  }

  const activeByAbstractToken = new Map<string, FormulaLeaf[]>()
  for (const [key, leaf] of active) {
    const abstractTokenId = tokens.get(key)?.abstractToken?.id
    if (!abstractTokenId) continue
    const leaves = activeByAbstractToken.get(abstractTokenId) ?? []
    leaves.push(leaf)
    activeByAbstractToken.set(abstractTokenId, leaves)
  }

  return {
    project,
    plugins: new Set(project.plugins),
    active,
    scheduled,
    activeByAbstractToken,
  }
}

function buildTokenInfo(
  deployedTokens: DeployedTokenRecord[],
  abstractTokens: AbstractTokenRecord[],
): Map<string, TokenInfo> {
  const abstractById = new Map(abstractTokens.map((token) => [token.id, token]))
  return new Map(
    deployedTokens.map((token) => [
      tokenKey(token.chain, token.address),
      {
        deployedToken: token,
        abstractToken: token.abstractTokenId
          ? abstractById.get(token.abstractTokenId)
          : undefined,
      },
    ]),
  )
}

function buildRelationIndex(
  relations: TokenRelationRoute[],
): Map<string, RelationEdge[]> {
  const result = new Map<string, RelationEdge[]>()
  for (const relation of relations) {
    const a = tokenKey(relation.tokenAChain, relation.tokenAAddress)
    const b = tokenKey(relation.tokenBChain, relation.tokenBAddress)
    addEdge(result, a, b, relation, 'A')
    addEdge(result, b, a, relation, 'B')
  }
  return result
}

function addEdge(
  index: Map<string, RelationEdge[]>,
  key: string,
  counterpart: string,
  relation: TokenRelationRoute,
  endpoint: 'A' | 'B',
) {
  const role = getRelationRole(relation, endpoint)
  if (!role) return
  const edges = index.get(key) ?? []
  edges.push({
    plugin: relation.plugin,
    bridgeType: relation.bridgeType,
    role,
    counterpart,
  })
  index.set(key, edges)
}

function getRelationRole(
  relation: TokenRelationRoute,
  endpoint: 'A' | 'B',
): RelationRole | undefined {
  switch (relation.bridgeType) {
    case 'burnAndMint':
      return 'burnAndMint'
    case 'lockAndMint':
      if (relation.lockedToken === null) return 'unknown'
      return relation.lockedToken === endpoint ? 'locked' : 'minted'
    case 'unknown':
      return 'unknown'
    case 'nonMinting':
      return undefined
  }
}

function collapseRoles(roles: RelationRole[]): InteropTokenRole | undefined {
  if (roles.length === 0) return undefined
  const set = new Set(roles)
  if (set.has('locked') && set.has('minted')) return 'both'
  if (set.has('locked')) return 'locked'
  if (set.has('minted')) return 'minted'
  if (set.has('burnAndMint')) return 'burnAndMint'
  return 'unknown'
}
