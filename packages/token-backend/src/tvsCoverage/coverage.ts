import type { Formula, TvsToken } from '@l2beat/config'
import type {
  AbstractTokenRecord,
  AggregatedInteropDeployedTokenStats,
  DeployedTokenRecord,
  TokenRelationRoute,
} from '@l2beat/database'
import {
  type InteropPluginObservation,
  InteropTransferClassifier,
  type InteropTransferPluginMatcher,
} from '@l2beat/shared'
import type { InteropBridgeType } from '@l2beat/shared-pure'
import { normalizeInteropTokenAddress } from '../ingestion/tokenIngestionUtils'
import {
  collectActiveLeaves,
  collectScheduledLeaves,
  type FormulaLeaf,
} from './formulas'
import {
  collapseRoles,
  type InteropTokenRole,
  type RelationEdge,
  RelationIndex,
} from './relations'
import { TokenIndex, type TokenRef, tokenKey } from './tokens'

export interface TvsProjectInput {
  id: string
  name: string
  chain: string | undefined
  plugins: InteropTransferPluginMatcher[]
  tokens: TvsToken[]
}

export type CoverageStatus =
  | 'counted'
  | 'countedViaCounterpart'
  | 'scheduled'
  | 'sameAssetOnly'
  | 'missing'

// `chain`: a token on the project's own chain, moved by any bridge.
// `escrow`: a token on another chain that the project's own lock-and-mint
// bridge moved, so the project escrow should hold it.
export type CoverageSide = 'chain' | 'escrow'

export interface CoverageBridge {
  id: string
  bridgeType: InteropBridgeType
  volumeUsd: number
  transferCount: number
}

export interface Pricing {
  coingeckoId: string
  via: (TokenRef & { symbol: string }) | undefined
}

export interface MintedCopy extends TokenRef {
  symbol: string | undefined
  decimals: number | undefined
}

export interface CoverageRow extends TokenRef {
  projectId: string
  side: CoverageSide
  symbol: string | undefined
  decimals: number | undefined
  abstractTokenId: string | undefined
  abstractSymbol: string | undefined
  issuer: string | undefined
  iconUrl: string | undefined
  coingeckoId: string | undefined
  pricing: Pricing | undefined
  ignored: boolean
  status: CoverageStatus
  countedVia: TokenRef | undefined
  role: InteropTokenRole | undefined
  bridges: CoverageBridge[]
  volumeUsd: number
  transferCount: number
  lastSeen: number
  // On a chain row, the escrow row whose token the project's own bridge locked
  // to mint this one. The two rows are one gap, seen from both sides.
  pairedWith: TokenRef | undefined
}

export interface CoverageInput {
  stats: AggregatedInteropDeployedTokenStats[]
  projects: TvsProjectInput[]
  deployedTokens: DeployedTokenRecord[]
  abstractTokens: AbstractTokenRecord[]
  relations: TokenRelationRoute[]
  timestamp: number
  minChainVolumeUsd: number
}

export class Coverage {
  readonly rows: CoverageRow[]
  private readonly tokens: TokenIndex
  private readonly relations: RelationIndex
  private readonly projects: Map<string, ProjectFormulas>

  constructor(input: CoverageInput) {
    this.tokens = new TokenIndex(input.deployedTokens, input.abstractTokens)
    this.relations = new RelationIndex(input.relations)
    const projects = input.projects.map(
      (project) => new ProjectFormulas(project, this.tokens, input.timestamp),
    )
    this.projects = new Map(projects.map((project) => [project.id, project]))
    const rows = collectRows(input.stats, projects, this.relations)
      .map((row) => toCoverageRow(row, this.tokens, this.relations))
      // A project's own bridge seldom moves what its escrow already holds, so
      // escrow rows are kept at any volume.
      .filter(
        (row) =>
          row.side === 'escrow' || row.volumeUsd >= input.minChainVolumeUsd,
      )
      .sort(
        (a, b) =>
          b.volumeUsd - a.volumeUsd ||
          b.transferCount - a.transferCount ||
          a.projectId.localeCompare(b.projectId) ||
          tokenKey(a).localeCompare(tokenKey(b)),
      )
    const escrowByCopy = new Map<string, TokenRef>()
    for (const row of rows) {
      const copy =
        row.side === 'escrow' ? this.mintedCopy(row.projectId, row) : undefined
      if (copy)
        escrowByCopy.set(`${row.projectId}:${tokenKey(copy)}`, toRef(row))
    }
    this.rows = rows.map((row) => ({
      ...row,
      pairedWith:
        row.side === 'chain'
          ? escrowByCopy.get(`${row.projectId}:${tokenKey(row)}`)
          : undefined,
    }))
  }

  // Counted directly, or through its counterpart on the project's own bridge.
  isCounted(projectId: string, token: TokenRef): boolean {
    const project = this.projects.get(projectId)
    return (
      project !== undefined &&
      (project.counts(token) !== undefined ||
        project.countedCounterpart(token, this.relations) !== undefined)
    )
  }

  escrowAddresses(projectId: string, chain: string): string[] {
    return this.projects.get(projectId)?.escrowAddresses(chain) ?? []
  }

  // The copy the project's own bridge minted for a token its escrow locks. A
  // chain project's copy is on its chain.
  mintedCopy(projectId: string, token: TokenRef): MintedCopy | undefined {
    const project = this.projects.get(projectId)
    if (!project) return undefined
    const copies = project
      .ownBridgeEdges(token, this.relations)
      .filter(
        (edge) => edge.bridgeType === 'lockAndMint' && edge.role === 'locked',
      )
      .map(({ counterpart }): MintedCopy => {
        const { deployedToken } = this.tokens.get(counterpart)
        return {
          ...counterpart,
          symbol: deployedToken?.symbol,
          decimals: deployedToken?.decimals,
        }
      })
    return project.chain
      ? copies.find((copy) => copy.chain === project.chain)
      : copies[0]
  }
}

class ProjectFormulas {
  private readonly matchesPlugin: (
    observation: InteropPluginObservation,
  ) => boolean
  private readonly counted = new Map<string, FormulaLeaf>()
  private readonly scheduled = new Set<string>()
  private readonly countedByAbstractToken = new Map<string, FormulaLeaf[]>()
  private readonly escrows = new Map<string, Set<string>>()

  constructor(
    readonly project: TvsProjectInput,
    private readonly tokens: TokenIndex,
    timestamp: number,
  ) {
    this.matchesPlugin = new InteropTransferClassifier().createPluginMatcher(
      project.plugins,
    )
    for (const formula of project.tokens.flatMap(countedFormulas)) {
      for (const leaf of collectActiveLeaves(formula, timestamp)) {
        this.addCounted(leaf)
      }
      for (const leaf of collectScheduledLeaves(formula, timestamp)) {
        this.scheduled.add(tokenKey(leaf))
      }
    }
  }

  get id() {
    return this.project.id
  }

  get chain() {
    return this.project.chain
  }

  counts(token: TokenRef): FormulaLeaf | undefined {
    return this.counted.get(tokenKey(token))
  }

  schedules(token: TokenRef): boolean {
    return this.scheduled.has(tokenKey(token))
  }

  countedDeploymentsOf(abstractTokenId: string): FormulaLeaf[] {
    return this.countedByAbstractToken.get(abstractTokenId) ?? []
  }

  escrowAddresses(chain: string): string[] {
    return Array.from(this.escrows.get(chain) ?? []).sort()
  }

  // Relations of the project's own bridge, scoped by chain and abstract token
  // as interop attributes transfers to the project.
  ownBridgeEdges(token: TokenRef, relations: RelationIndex): RelationEdge[] {
    return relations.edgesOf(token).filter((edge) =>
      this.matchesPlugin({
        plugin: edge.plugin,
        bridgeType: edge.bridgeType === 'unknown' ? undefined : edge.bridgeType,
        srcChain: token.chain,
        dstChain: edge.counterpart.chain,
        srcAbstractTokenId: this.tokens.get(token).abstractToken?.id,
        dstAbstractTokenId: this.tokens.get(edge.counterpart).abstractToken?.id,
      }),
    )
  }

  // A lock-and-mint copy is backed by its locked counterpart, and the other
  // way round, even when the relation does not say which side is locked. Only
  // the project's own bridge counts: the project escrow does not hold what a
  // third-party bridge locked.
  backingEdges(token: TokenRef, relations: RelationIndex): RelationEdge[] {
    return this.ownBridgeEdges(token, relations).filter(
      (edge) => edge.bridgeType === 'lockAndMint',
    )
  }

  countedCounterpart(
    token: TokenRef,
    relations: RelationIndex,
  ): FormulaLeaf | undefined {
    for (const edge of this.backingEdges(token, relations)) {
      const leaf = this.counts(edge.counterpart)
      if (leaf) return leaf
    }
    return undefined
  }

  private addCounted(leaf: FormulaLeaf) {
    const escrows = this.escrows.get(leaf.chain) ?? new Set<string>()
    for (const address of leaf.escrowAddresses) escrows.add(address)
    this.escrows.set(leaf.chain, escrows)

    const key = tokenKey(leaf)
    if (this.counted.has(key)) return
    this.counted.set(key, leaf)

    const abstractTokenId = this.tokens.get(leaf).abstractToken?.id
    if (!abstractTokenId) return
    const leaves = this.countedByAbstractToken.get(abstractTokenId) ?? []
    leaves.push(leaf)
    this.countedByAbstractToken.set(abstractTokenId, leaves)
  }
}

interface RowDraft {
  project: ProjectFormulas
  side: CoverageSide
  token: TokenRef
  bridges: Map<string, CoverageBridge>
  lastSeen: number
}

function collectRows(
  stats: AggregatedInteropDeployedTokenStats[],
  projects: ProjectFormulas[],
  relations: RelationIndex,
): RowDraft[] {
  const byChain = new Map(
    projects.flatMap((project) =>
      project.chain ? [[project.chain, project] as const] : [],
    ),
  )
  const byId = new Map(projects.map((project) => [project.id, project]))
  const rows = new Map<string, RowDraft>()

  for (const stat of stats) {
    const address = normalizeInteropTokenAddress(stat.tokenAddress)
    if (!address) continue
    const token = { chain: stat.tokenChain, address }

    const chainProject = byChain.get(token.chain)
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
  return Array.from(rows.values())
}

// The other side of a project's own lock-and-mint bridge is where the project
// escrow sits: Ethereum for an L2, the parent chain for an L3. Relations decide
// when they say which side is locked, e.g. for tokens native to the L2 and
// minted on Ethereum, or for bridges that are not a chain.
function isLockedByProject(
  project: ProjectFormulas,
  token: TokenRef,
  relations: RelationIndex,
): boolean {
  const roles = project
    .ownBridgeEdges(token, relations)
    .map((edge) => edge.role)
  if (roles.includes('locked')) return true
  if (roles.includes('minted')) return false
  return project.chain !== undefined
}

function addStat(
  rows: Map<string, RowDraft>,
  project: ProjectFormulas,
  side: CoverageSide,
  token: TokenRef,
  stat: AggregatedInteropDeployedTokenStats,
) {
  const key = `${project.id}:${tokenKey(token)}`
  const row = rows.get(key) ?? {
    project,
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

function toCoverageRow(
  row: RowDraft,
  tokens: TokenIndex,
  relations: RelationIndex,
): Omit<CoverageRow, 'pairedWith'> {
  const { deployedToken, abstractToken } = tokens.get(row.token)
  const edges = relations.edgesOf(row.token)
  const bridges = Array.from(row.bridges.values()).sort(
    (a, b) => b.volumeUsd - a.volumeUsd || a.id.localeCompare(b.id),
  )
  const { status, countedVia } = classify(
    row,
    abstractToken?.id,
    relations,
    bridges,
  )

  return {
    projectId: row.project.id,
    side: row.side,
    chain: row.token.chain,
    address: row.token.address,
    symbol: deployedToken?.symbol ?? abstractToken?.symbol,
    decimals: deployedToken?.decimals,
    abstractTokenId: abstractToken?.id,
    abstractSymbol: abstractToken?.symbol,
    issuer: abstractToken?.issuer ?? undefined,
    iconUrl: abstractToken?.iconUrl ?? undefined,
    coingeckoId: abstractToken?.coingeckoId ?? undefined,
    pricing: getPricing(abstractToken, edges, tokens),
    ignored: deployedToken?.ignored ?? false,
    status,
    countedVia,
    role: collapseRoles(edges.map((edge) => edge.role)),
    bridges,
    volumeUsd: sum(bridges.map((bridge) => bridge.volumeUsd)),
    transferCount: sum(bridges.map((bridge) => bridge.transferCount)),
    lastSeen: row.lastSeen,
  }
}

function classify(
  row: RowDraft,
  abstractTokenId: string | undefined,
  relations: RelationIndex,
  bridges: CoverageBridge[],
): { status: CoverageStatus; countedVia: TokenRef | undefined } {
  const { project } = row
  if (project.counts(row.token)) {
    return { status: 'counted', countedVia: undefined }
  }

  const counted = project.countedCounterpart(row.token, relations)
  if (counted) {
    return { status: 'countedViaCounterpart', countedVia: toRef(counted) }
  }

  // Without a relation for the project's own bridge, the other side of that
  // bridge is assumed to hold the same asset.
  const sameAsset = abstractTokenId
    ? project.countedDeploymentsOf(abstractTokenId)
    : []
  const movedByOwnBridge = bridges.some(
    (bridge) => bridge.id === project.id && bridge.bridgeType === 'lockAndMint',
  )
  if (
    movedByOwnBridge &&
    project.backingEdges(row.token, relations).length === 0
  ) {
    const counterpart = sameAsset.find((leaf) =>
      row.side === 'chain'
        ? leaf.chain !== project.chain
        : leaf.chain === project.chain,
    )
    if (counterpart) {
      return { status: 'countedViaCounterpart', countedVia: toRef(counterpart) }
    }
  }

  if (project.schedules(row.token)) {
    return { status: 'scheduled', countedVia: undefined }
  }
  if (sameAsset.length > 0) {
    return { status: 'sameAssetOnly', countedVia: undefined }
  }
  return { status: 'missing', countedVia: undefined }
}

// A lock-and-mint copy is worth what its locked counterpart is worth, which
// prices copies CoinGecko does not list on their chain.
function getPricing(
  abstractToken: AbstractTokenRecord | undefined,
  edges: RelationEdge[],
  tokens: TokenIndex,
): Pricing | undefined {
  if (abstractToken?.coingeckoId) {
    return abstractToken.isPriceUnreliable
      ? undefined
      : { coingeckoId: abstractToken.coingeckoId, via: undefined }
  }
  for (const edge of edges) {
    if (edge.bridgeType !== 'lockAndMint' || edge.role !== 'minted') continue
    const counterpart = tokens.get(edge.counterpart)
    const coingeckoId = counterpart.abstractToken?.coingeckoId
    if (
      counterpart.deployedToken &&
      coingeckoId &&
      !counterpart.abstractToken?.isPriceUnreliable
    ) {
      return {
        coingeckoId,
        via: { ...edge.counterpart, symbol: counterpart.deployedToken.symbol },
      }
    }
  }
  return undefined
}

function toRef({ chain, address }: TokenRef): TokenRef {
  return { chain, address }
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0)
}

// The TVS runtime values the project with `valueForProject` and the summary
// with `valueForSummary` when they are set, so their deployments count too.
function countedFormulas(token: TvsToken): Formula[] {
  return [token.amount, token.valueForProject, token.valueForSummary].filter(
    (formula) => formula !== undefined,
  )
}
