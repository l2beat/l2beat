import type { TokenRelationRoute } from '@l2beat/database'
import type { InteropBridgeType } from '@l2beat/shared-pure'
import { type TokenRef, tokenKey, toTokenRef } from './tokens'

export type RelationRole = 'locked' | 'minted' | 'burnAndMint' | 'unknown'
export type InteropTokenRole = RelationRole | 'both'

export interface RelationEdge {
  plugin: string
  bridgeType: InteropBridgeType
  role: RelationRole
  counterpart: TokenRef
}

// Token relations seen from each of their two tokens.
export class RelationIndex {
  private readonly edges = new Map<string, RelationEdge[]>()

  constructor(routes: TokenRelationRoute[]) {
    for (const route of routes) {
      const a = toTokenRef(route.tokenAChain, route.tokenAAddress)
      const b = toTokenRef(route.tokenBChain, route.tokenBAddress)
      this.add(a, b, route, 'A')
      this.add(b, a, route, 'B')
    }
  }

  edgesOf(token: TokenRef): RelationEdge[] {
    return this.edges.get(tokenKey(token)) ?? []
  }

  private add(
    token: TokenRef,
    counterpart: TokenRef,
    route: TokenRelationRoute,
    side: 'A' | 'B',
  ) {
    const role = getRole(route, side)
    if (!role) return
    const key = tokenKey(token)
    const edges = this.edges.get(key) ?? []
    edges.push({
      plugin: route.plugin,
      bridgeType: route.bridgeType,
      role,
      counterpart,
    })
    this.edges.set(key, edges)
  }
}

export function collapseRoles(
  roles: RelationRole[],
): InteropTokenRole | undefined {
  if (roles.length === 0) return undefined
  const set = new Set(roles)
  if (set.has('locked') && set.has('minted')) return 'both'
  if (set.has('locked')) return 'locked'
  if (set.has('minted')) return 'minted'
  if (set.has('burnAndMint')) return 'burnAndMint'
  return 'unknown'
}

function getRole(
  route: TokenRelationRoute,
  side: 'A' | 'B',
): RelationRole | undefined {
  switch (route.bridgeType) {
    case 'burnAndMint':
      return 'burnAndMint'
    case 'lockAndMint':
      if (route.lockedToken === null) return 'unknown'
      return route.lockedToken === side ? 'locked' : 'minted'
    case 'unknown':
      return 'unknown'
    case 'nonMinting':
      return undefined
  }
}
