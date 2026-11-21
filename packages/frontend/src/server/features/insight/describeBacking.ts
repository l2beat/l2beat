import type { TokenRelationRoute } from '@l2beat/database'
import { assert } from '@l2beat/shared-pure'
import type { ProjectIconListItem } from '~/components/ProjectIconList'
import type {
  InsightBacking,
  InsightChain,
  InsightRouteGroup,
} from './InsightReport'

export interface DeploymentKey {
  chain: string
  /** Lowercase, as token-db stores it. */
  address: string
}

export interface BridgeObservation {
  plugin: string
  bridgeType: 'lockAndMint' | 'burnAndMint'
  /** The chain value comes from: the locked side of a lock-and-mint. */
  srcChain: string
  dstChain: string
}

type Role = keyof InsightBacking

interface RoleGroup {
  role: Role
  plugin: string
  observations: BridgeObservation[]
  otherChains: Set<string>
}

/**
 * What the deployment's relations say about whom its holder trusts. Each
 * role's routes are grouped by plugin, so "minted by Wormhole against tokens
 * locked on Solana and Sui" is one group with two chains.
 */
export function describeBacking(
  deployment: DeploymentKey,
  routes: TokenRelationRoute[],
  resolveBridges: (observation: BridgeObservation) => ProjectIconListItem[],
  resolveChain: (chainId: string) => InsightChain,
): InsightBacking {
  const groups = new Map<string, RoleGroup>()

  for (const route of routes) {
    const sides = getSides(deployment, route)
    if (!sides) continue
    const role = getRole(route, sides.slot)
    if (!role) continue
    assert(
      route.bridgeType === 'lockAndMint' || route.bridgeType === 'burnAndMint',
      'A role implies a minting bridge type',
    )

    const key = `${role}:${route.plugin}`
    const group = groups.get(key) ?? {
      role,
      plugin: route.plugin,
      observations: [],
      otherChains: new Set<string>(),
    }
    groups.set(key, group)
    group.otherChains.add(sides.other.chain)
    // Value flows into a minted deployment from the locked one, and out of
    // a locked one; a burn-and-mint pair has no direction, so either works.
    const valueFlowsIn = role === 'mintedAgainst'
    group.observations.push({
      plugin: route.plugin,
      bridgeType: route.bridgeType,
      srcChain: valueFlowsIn ? sides.other.chain : deployment.chain,
      dstChain: valueFlowsIn ? deployment.chain : sides.other.chain,
    })
  }

  function toGroups(role: Role): InsightRouteGroup[] {
    return [...groups.values()]
      .filter((group) => group.role === role)
      .map((group) => {
        // A plugin's projects can depend on the chain pair, so every route
        // is resolved and the projects are merged.
        const bridges = new Map(
          group.observations
            .flatMap(resolveBridges)
            .map((bridge) => [bridge.id, bridge]),
        )
        return {
          plugin: group.plugin,
          bridges: [...bridges.values()],
          chains: [...group.otherChains].sort().map(resolveChain),
        }
      })
      .sort((a, b) => a.plugin.localeCompare(b.plugin))
  }

  return {
    mintedAgainst: toGroups('mintedAgainst'),
    burnAndMint: toGroups('burnAndMint'),
    lockedFor: toGroups('lockedFor'),
    unknownRole: toGroups('unknownRole'),
  }
}

/**
 * Each deployment's routes, so a report describes each holding from its own
 * routes rather than scanning every route once per holding.
 */
export function groupRoutesByDeployment(
  routes: TokenRelationRoute[],
): Map<string, TokenRelationRoute[]> {
  const byDeployment = new Map<string, TokenRelationRoute[]>()
  for (const route of routes) {
    const keyA = toDeploymentKey(route.tokenAChain, route.tokenAAddress)
    const keyB = toDeploymentKey(route.tokenBChain, route.tokenBAddress)
    pushRoute(byDeployment, keyA, route)
    if (keyB !== keyA) pushRoute(byDeployment, keyB, route)
  }
  return byDeployment
}

export function toDeploymentKey(chain: string, address: string): string {
  return `${chain}:${address.toLowerCase()}`
}

function pushRoute(
  byDeployment: Map<string, TokenRelationRoute[]>,
  key: string,
  route: TokenRelationRoute,
) {
  const routes = byDeployment.get(key)
  if (routes) routes.push(route)
  else byDeployment.set(key, [route])
}

function getSides(deployment: DeploymentKey, route: TokenRelationRoute) {
  const a = { chain: route.tokenAChain, address: route.tokenAAddress }
  const b = { chain: route.tokenBChain, address: route.tokenBAddress }
  if (isSame(deployment, a)) return { slot: 'A' as const, other: b }
  if (isSame(deployment, b)) return { slot: 'B' as const, other: a }
  return undefined
}

function getRole(route: TokenRelationRoute, slot: 'A' | 'B'): Role | undefined {
  if (route.bridgeType === 'burnAndMint') return 'burnAndMint'
  if (route.bridgeType !== 'lockAndMint') return undefined
  if (route.lockedToken === null) return 'unknownRole'
  if (route.lockedToken === slot) return 'lockedFor'
  return 'mintedAgainst'
}

function isSame(deployment: DeploymentKey, endpoint: DeploymentKey) {
  if (deployment.chain !== endpoint.chain) return false
  return deployment.address === endpoint.address.toLowerCase()
}
