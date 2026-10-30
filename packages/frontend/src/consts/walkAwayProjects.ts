import type { UnixTime } from '@l2beat/shared-pure'

export type WalkAwayVerdict = 'passed' | 'not-passed'

const WALK_AWAY_PASSED_PROJECTS = [
  'arbitrum',
  'base',
  'optimism',
  'ink',
  'unichain',
  'facet',
  'ethscriptions',
  'aztecnetwork',
  'aztecnetworkv6',
  'dydx',
  'fuelv1',
]

const WALK_AWAY_NOT_PASSED_PROJECTS = ['starknet']

/**
 * Archived projects fail unless listed as passed: their operators are gone,
 * so nothing assures an exit.
 */
export function getWalkAwayVerdict(project: {
  id: string
  archivedAt: UnixTime
}): WalkAwayVerdict
export function getWalkAwayVerdict(project: {
  id: string
  archivedAt?: UnixTime
}): WalkAwayVerdict | undefined
export function getWalkAwayVerdict(project: {
  id: string
  archivedAt?: UnixTime
}): WalkAwayVerdict | undefined {
  if (WALK_AWAY_PASSED_PROJECTS.includes(project.id)) return 'passed'
  if (
    project.archivedAt !== undefined ||
    WALK_AWAY_NOT_PASSED_PROJECTS.includes(project.id)
  ) {
    return 'not-passed'
  }
  return undefined
}
