import type { Formula, TvsToken } from '@l2beat/config'
import type {
  AbstractTokenRecord,
  DeployedTokenRecord,
  InteropDeploymentStatsRecord,
  TokenRelationRoute,
} from '@l2beat/database'
import { Address32 } from '@l2beat/shared-pure'

export interface TvsProjectInput {
  projectName: string
  projectIconUrl?: string
  chain: string
  explorerUrl?: string
  tokens?: TvsToken[]
}

export interface ProjectTvsDeployment {
  projectChain: string
  tokenChain: string
  address: string
}

export interface InteropDeployment {
  chain: string
  address: string
  symbol?: string
  abstractTokenId?: string
  abstractSymbol?: string
  issuer?: string
  iconUrl?: string
  ignored: boolean
  volumeUsd: number
  transferCount: number
  unvaluedTransferCount: number
  plugins: string[]
}

export interface CoverageRow extends InteropDeployment {
  included: boolean
  role?: InteropTokenRole
  pluginRoles: PluginRole[]
}

export type InteropTokenRole =
  | 'locked'
  | 'minted'
  | 'burnAndMint'
  | 'both'
  | 'unknown'

export type InteropRelationRole = Exclude<InteropTokenRole, 'both'>

export interface PluginRole {
  plugin: string
  roles: InteropRelationRole[]
}

interface MutableInteropDeployment {
  chain: string
  address: string
  observedSymbols: Set<string>
  observedAbstractTokenIds: Set<string>
  volumeUsd: number
  transferCount: number
  unvaluedTransferCount: number
  plugins: Set<string>
}

interface IndexedTvsToken {
  exactDeploymentKeys: Set<string>
  abstractTokenIds: Set<string>
}

interface TvsProjectIndex {
  project: TvsProjectInput
  tokens: IndexedTvsToken[]
}

const NON_EVM_TOKEN_ADDRESS_CHAINS = new Set(['solana', 'starknet', 'tron'])

export function normalizeTokenAddress(chain: string, address: string): string {
  const normalized = address.toLowerCase()
  if (normalized === 'native') return normalized
  if (NON_EVM_TOKEN_ADDRESS_CHAINS.has(chain)) {
    return normalized.startsWith('0x') ? normalized : address
  }
  if (!normalized.startsWith('0x')) return address

  try {
    return Address32.cropToEthereumAddress(
      Address32.from(normalized),
    ).toLowerCase()
  } catch {
    return normalized
  }
}

export function collectAmountDeployments(
  formula: Formula,
  timestamp?: number,
): { chain: string; address: string }[] {
  const result = collectFormulaDeployments(formula, timestamp)
  return result.active ? result.deployments : []
}

function collectFormulaDeployments(
  formula: Formula,
  timestamp: number | undefined,
): {
  active: boolean
  deployments: { chain: string; address: string }[]
} {
  switch (formula.type) {
    case 'calculation': {
      const activeArguments = formula.arguments
        .map((argument) => collectFormulaDeployments(argument, timestamp))
        .filter((argument) => argument.active)
      const active =
        formula.operator === 'diff'
          ? activeArguments.length >= 2
          : activeArguments.length >= 1

      return {
        active,
        deployments: active
          ? uniqueDeployments(
              activeArguments.flatMap((argument) => argument.deployments),
            )
          : [],
      }
    }
    case 'value':
      return collectFormulaDeployments(formula.amount, timestamp)
    case 'balanceOfEscrow':
    case 'starknetBalanceOf':
    case 'totalSupply':
    case 'starknetTotalSupply':
    case 'circulatingSupply':
      return {
        active: isFormulaActive(formula, timestamp),
        deployments: [{ chain: formula.chain, address: formula.address }],
      }
    case 'const':
      return {
        active: isFormulaActive(formula, timestamp),
        deployments: [],
      }
  }
}

function isFormulaActive(
  formula: Extract<Formula, { sinceTimestamp: number }>,
  timestamp: number | undefined,
) {
  if (timestamp === undefined) return true
  return (
    formula.sinceTimestamp < timestamp &&
    (formula.untilTimestamp === undefined || formula.untilTimestamp > timestamp)
  )
}

export function collectProjectTvsDeployments(
  projects: TvsProjectInput[],
  timestamp?: number,
): ProjectTvsDeployment[] {
  const deployments = projects.flatMap((project) =>
    (project.tokens ?? []).flatMap((token) =>
      collectAmountDeployments(token.amount, timestamp).map((deployment) => ({
        projectChain: project.chain,
        tokenChain: deployment.chain,
        address: normalizeTokenAddress(deployment.chain, deployment.address),
      })),
    ),
  )

  return Array.from(
    new Map(
      deployments.map((deployment) => [
        `${deployment.projectChain}:${deployment.tokenChain}:${deployment.address}`,
        deployment,
      ]),
    ).values(),
  )
}

export function aggregateInteropDeploymentStats(
  stats: InteropDeploymentStatsRecord[],
  deployedTokens: DeployedTokenRecord[],
  abstractTokens: AbstractTokenRecord[],
): InteropDeployment[] {
  const mutable = new Map<string, MutableInteropDeployment>()

  for (const stat of stats) {
    const address = normalizeTokenAddress(stat.chain, stat.address)
    const key = deploymentKey(stat.chain, address)
    const current = mutable.get(key) ?? {
      chain: stat.chain,
      address,
      observedSymbols: new Set<string>(),
      observedAbstractTokenIds: new Set<string>(),
      volumeUsd: 0,
      transferCount: 0,
      unvaluedTransferCount: 0,
      plugins: new Set<string>(),
    }

    if (stat.symbol) current.observedSymbols.add(stat.symbol)
    if (stat.abstractTokenId) {
      current.observedAbstractTokenIds.add(stat.abstractTokenId)
    }
    current.volumeUsd += stat.volumeUsd
    current.transferCount += stat.transferCount
    current.unvaluedTransferCount +=
      stat.transferCount - stat.valuedTransferCount
    current.plugins.add(stat.plugin)
    mutable.set(key, current)
  }

  return finalizeInteropDeployments(mutable, deployedTokens, abstractTokens)
}

export function buildCoverage(
  deployments: InteropDeployment[],
  projects: TvsProjectInput[],
  deployedTokens: DeployedTokenRecord[],
  timestamp?: number,
): CoverageRow[] {
  const projectIndices = buildTvsProjectIndices(
    projects,
    deployedTokens,
    timestamp,
  )

  return deployments.flatMap((deployment) => {
    const projectIndex = projectIndices.get(deployment.chain)
    if (!projectIndex || projectIndex.project.tokens === undefined) return []

    return [
      {
        ...deployment,
        included: isIncluded(deployment, projectIndex),
        pluginRoles: [],
      },
    ]
  })
}

export function attachInteropRoles(
  rows: CoverageRow[],
  relations: TokenRelationRoute[],
): CoverageRow[] {
  const rolesByDeployment = new Map<
    string,
    Map<string, Set<InteropRelationRole>>
  >()

  for (const relation of relations) {
    addRelationRole(rolesByDeployment, relation, 'A')
    addRelationRole(rolesByDeployment, relation, 'B')
  }

  return rows.map((row) => {
    const byPlugin = rolesByDeployment.get(
      deploymentKey(row.chain, row.address),
    )
    const pluginRoles = row.plugins.flatMap((plugin) => {
      const roles = sortRoles(byPlugin?.get(plugin))
      return roles.length > 0 ? [{ plugin, roles }] : []
    })

    return {
      ...row,
      role: collapseRoles(new Set(pluginRoles.flatMap(({ roles }) => roles))),
      pluginRoles,
    }
  })
}

function addRelationRole(
  rolesByDeployment: Map<string, Map<string, Set<InteropRelationRole>>>,
  relation: TokenRelationRoute,
  endpoint: 'A' | 'B',
) {
  const role = getRelationRole(relation, endpoint)
  if (!role) return

  const chain = endpoint === 'A' ? relation.tokenAChain : relation.tokenBChain
  const address =
    endpoint === 'A' ? relation.tokenAAddress : relation.tokenBAddress
  const key = deploymentKey(chain, address)
  const byPlugin = rolesByDeployment.get(key) ?? new Map()
  const roles = byPlugin.get(relation.plugin) ?? new Set()
  roles.add(role)
  byPlugin.set(relation.plugin, roles)
  rolesByDeployment.set(key, byPlugin)
}

function getRelationRole(
  relation: TokenRelationRoute,
  endpoint: 'A' | 'B',
): InteropRelationRole | undefined {
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

function collapseRoles(
  roles: Set<InteropRelationRole> | undefined,
): InteropTokenRole | undefined {
  if (!roles || roles.size === 0) return undefined

  if (roles.has('locked') && roles.has('minted')) return 'both'
  if (roles.has('locked')) return 'locked'
  if (roles.has('minted')) return 'minted'
  if (roles.has('burnAndMint')) return 'burnAndMint'
  return 'unknown'
}

function sortRoles(
  roles: Set<InteropRelationRole> | undefined,
): InteropRelationRole[] {
  if (!roles) return []
  const order: InteropRelationRole[] = [
    'locked',
    'minted',
    'burnAndMint',
    'unknown',
  ]
  return order.filter((role) => roles.has(role))
}

function finalizeInteropDeployments(
  deployments: Map<string, MutableInteropDeployment>,
  deployedTokens: DeployedTokenRecord[],
  abstractTokens: AbstractTokenRecord[],
): InteropDeployment[] {
  const deployedByKey = new Map(
    deployedTokens.map((token) => [
      deploymentKey(token.chain, token.address),
      token,
    ]),
  )
  const abstractById = new Map(abstractTokens.map((token) => [token.id, token]))

  return Array.from(deployments.entries(), ([key, deployment]) => {
    const deployedToken = deployedByKey.get(key)
    const abstractTokenId =
      deployedToken?.abstractTokenId ??
      Array.from(deployment.observedAbstractTokenIds)[0]
    const abstractToken = abstractTokenId
      ? abstractById.get(abstractTokenId)
      : undefined

    return {
      chain: deployment.chain,
      address: deployment.address,
      symbol:
        deployedToken?.symbol ??
        Array.from(deployment.observedSymbols)[0] ??
        abstractToken?.symbol,
      abstractTokenId: abstractTokenId ?? undefined,
      abstractSymbol: abstractToken?.symbol,
      issuer: abstractToken?.issuer ?? undefined,
      iconUrl: abstractToken?.iconUrl ?? undefined,
      ignored: deployedToken?.ignored ?? false,
      volumeUsd: deployment.volumeUsd,
      transferCount: deployment.transferCount,
      unvaluedTransferCount: deployment.unvaluedTransferCount,
      plugins: Array.from(deployment.plugins).sort(),
    }
  }).sort(
    (a, b) =>
      b.volumeUsd - a.volumeUsd ||
      b.transferCount - a.transferCount ||
      a.chain.localeCompare(b.chain) ||
      a.address.localeCompare(b.address),
  )
}

function buildTvsProjectIndices(
  projects: TvsProjectInput[],
  deployedTokens: DeployedTokenRecord[],
  timestamp: number | undefined,
) {
  const deployedByKey = new Map(
    deployedTokens.map((token) => [
      deploymentKey(token.chain, token.address),
      token,
    ]),
  )
  const result = new Map<string, TvsProjectIndex>()

  for (const project of projects) {
    const tokens = (project.tokens ?? []).map((token) => {
      const exactDeploymentKeys = new Set(
        collectAmountDeployments(token.amount, timestamp).map((deployment) =>
          deploymentKey(deployment.chain, deployment.address),
        ),
      )
      const abstractTokenIds = new Set<string>()

      for (const key of exactDeploymentKeys) {
        const abstractTokenId = deployedByKey.get(key)?.abstractTokenId
        if (abstractTokenId) abstractTokenIds.add(abstractTokenId)
      }

      return { exactDeploymentKeys, abstractTokenIds }
    })

    result.set(project.chain, { project, tokens })
  }

  return result
}

function isIncluded(
  deployment: InteropDeployment,
  projectIndex: TvsProjectIndex | undefined,
): boolean {
  if (!projectIndex || projectIndex.project.tokens === undefined) return false

  const key = deploymentKey(deployment.chain, deployment.address)
  if (projectIndex.tokens.some((token) => token.exactDeploymentKeys.has(key))) {
    return true
  }

  return Boolean(
    deployment.abstractTokenId &&
      projectIndex.tokens.some((token) =>
        token.abstractTokenIds.has(deployment.abstractTokenId as string),
      ),
  )
}

function deploymentKey(chain: string, address: string): string {
  return `${chain}:${normalizeTokenAddress(chain, address)}`
}

function uniqueDeployments(
  deployments: { chain: string; address: string }[],
): { chain: string; address: string }[] {
  return Array.from(
    new Map(
      deployments.map((deployment) => [
        deploymentKey(deployment.chain, deployment.address),
        deployment,
      ]),
    ).values(),
  )
}
