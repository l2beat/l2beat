import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v as z } from '@l2beat/validate'
import { type ProjectEntry, projectSchema } from './entries'
import {
  controlPaths,
  formatDelay,
  indexPermissionPaths,
} from './permissionPaths'
import { AgentRefError, resolveRef } from './resolveRef'
import { SelectorResolver, signersOf } from './selectors'

// DiscoUI's palette, in the order its color picker shows it; 0 is "by chain".
export const COLORS = [
  'red',
  'orange',
  'yellow',
  'teal',
  'green',
  'cyan',
  'blue',
  'purple',
  'pink',
  'white',
  'black',
]
const GROUP_COLORS = ['blue', 'orange', 'teal', 'purple', 'pink', 'cyan']
export const ARRANGEMENTS = ['keep', 'lanes']

const selectors = z.array(z.string())

export const agentViewSchema = z.object({
  project: projectSchema.optional(),
  title: z.string().check((v) => v.length > 0, 'A view needs a title'),
  note: z.string().optional(),
  hide: selectors.optional(),
  show: selectors.optional(),
  only: selectors.optional(),
  groups: z
    .array(
      z.object({
        name: z.string(),
        color: z.string().optional(),
        contracts: selectors,
      }),
    )
    .optional(),
  colors: z
    .array(z.object({ color: z.string(), contracts: selectors }))
    .optional(),
  arrange: z.string().optional(),
  // The contract the panels show once the view is applied.
  select: z.string().optional(),
  // Reports what the view would do without changing the graph.
  dryRun: z.boolean().optional(),
})
export type AgentViewRequest = z.infer<typeof agentViewSchema>

export interface AgentView {
  title: string
  note: string | undefined
  hide: ChainSpecificAddress[]
  show: ChainSpecificAddress[]
  only: ChainSpecificAddress[] | undefined
  groups: { name: string; color: number; members: ChainSpecificAddress[] }[]
  colors: { color: number; members: ChainSpecificAddress[] }[]
  arrange: 'keep' | 'lanes'
  select: ChainSpecificAddress | undefined
}

export interface SelectorMatch {
  selector: string
  count: number
  // What the selector's kind can match here, when it matched nothing.
  known?: string[]
}

export function resolveView(
  entries: readonly ProjectEntry[],
  request: AgentViewRequest,
): { view: AgentView; matches: SelectorMatch[] } {
  const resolver = new SelectorResolver(entries)
  const matches: SelectorMatch[] = []
  const resolveAll = (list: readonly string[] | undefined) => {
    const result = new Set<ChainSpecificAddress>()
    for (const selector of list ?? []) {
      const resolved = resolver.resolve(selector)
      matches.push({
        selector,
        count: resolved.length,
        known:
          resolved.length === 0 ? resolver.knownValues(selector) : undefined,
      })
      for (const address of resolved) result.add(address)
    }
    return [...result]
  }

  // A contract asked for in two groups stays in the first.
  const grouped = new Set<ChainSpecificAddress>()
  const groups = (request.groups ?? []).map((group, i) => {
    const members = resolveAll(group.contracts).filter((a) => !grouped.has(a))
    for (const member of members) grouped.add(member)
    const fallback = GROUP_COLORS[i % GROUP_COLORS.length] as string
    return {
      name: group.name,
      color: colorIndex(group.color ?? fallback),
      members,
    }
  })
  const view: AgentView = {
    title: request.title,
    note: request.note,
    hide: resolveAll(request.hide),
    show: resolveAll(request.show),
    only: request.only && resolveAll(request.only),
    groups,
    colors: (request.colors ?? []).map((c) => ({
      color: colorIndex(c.color),
      members: resolveAll(c.contracts),
    })),
    arrange: arrangement(request.arrange, groups.length > 0),
    select:
      request.select === undefined
        ? undefined
        : resolveRef(entries, request.select),
  }
  return { view, matches }
}

function colorIndex(name: string): number {
  const index = COLORS.indexOf(name.toLowerCase())
  if (index === -1) {
    throw new AgentRefError('Unknown color', name, COLORS)
  }
  return index + 1
}

function arrangement(value: string | undefined, hasGroups: boolean) {
  if (value === undefined) {
    return hasGroups ? 'lanes' : 'keep'
  }
  if (value !== 'keep' && value !== 'lanes') {
    throw new AgentRefError('Unknown arrangement', value, ARRANGEMENTS)
  }
  return value
}

const WEEK_SECONDS = 7 * 86_400

// The power structure at a glance: one lane per set of holders that can
// upgrade fastest, holders on top, colored by how long users get to exit.
export function controlMapRequest(
  entries: readonly ProjectEntry[],
  project: string,
  excluded: ReadonlySet<ChainSpecificAddress> = new Set(),
): AgentViewRequest {
  const byAddress = new Map(entries.map((e) => [e.address, e]))
  const displayName = displayNames(entries)
  const upgradesOf = upgradeRoutes(entries, byAddress)
  const lanes = new Map<string, Lane>()
  for (const entry of entries) {
    if (entry.isEOA || excluded.has(entry.address)) continue
    const upgrades = upgradesOf(entry.address)
    const delay = Math.min(...upgrades.map((u) => u.delaySeconds))
    const holders = [
      ...new Set(
        upgrades.filter((u) => u.delaySeconds === delay).map((u) => u.holder),
      ),
    ].sort()
    const key = upgrades.length === 0 ? '' : `${delay} ${holders.join()}`
    const lane = lanes.get(key) ?? { holders, delay, targets: [] }
    lane.targets.push(entry.address)
    lanes.set(key, lane)
  }
  const sorted = [...lanes.values()].sort(
    (a, b) =>
      laneOrder(a) - laneOrder(b) || b.targets.length - a.targets.length,
  )
  // Holders first, then the multisigs that sign for them, then what they
  // can upgrade. A contract in several lanes stays in the first.
  const members = (lane: Lane) => [
    ...lane.holders.filter((h) => !excluded.has(h)),
    ...lane.holders
      .flatMap((holder) => signersOf(holder, byAddress))
      .filter((s) => byAddress.get(s)?.isEOA === false && !excluded.has(s)),
    ...lane.targets,
  ]
  return {
    project,
    title: 'Who can upgrade what',
    note: 'One lane per fastest way to upgrade: who can do it and who signs for them, the delay users get, and every contract it reaches.',
    only: sorted.flatMap(members),
    groups: sorted.map((lane) => ({
      name: laneName(lane, byAddress, displayName),
      color: laneColor(lane),
      contracts: members(lane),
    })),
    arrange: 'lanes',
  }
}

export interface UpgradeRoute {
  holder: ChainSpecificAddress
  delaySeconds: number
}

// Who can upgrade a contract, as modelled: the holders the model passes the
// upgrade to, or when it stops at a contract (a ProxyAdmin owned by a role
// based contract), that contract.
export function upgradeRoutes(
  entries: readonly ProjectEntry[],
  byAddress: ReadonlyMap<ChainSpecificAddress, ProjectEntry>,
) {
  const index = indexPermissionPaths(entries)
  const direct = new Map<ChainSpecificAddress, UpgradeRoute[]>()
  for (const entry of entries) {
    for (const p of entry.directPermissions) {
      if (p.permission !== 'upgrade') continue
      const routes = direct.get(p.from) ?? []
      routes.push({ holder: entry.address, delaySeconds: p.delay ?? 0 })
      direct.set(p.from, routes)
    }
  }
  return (target: ChainSpecificAddress): UpgradeRoute[] => {
    const modelled = controlPaths(target, byAddress, index)
      .paths.filter((p) => p.permission === 'upgrade')
      .map((p) => ({
        holder: p.path[0] as ChainSpecificAddress,
        delaySeconds: p.delaySeconds,
      }))
    return modelled.length > 0 ? modelled : (direct.get(target) ?? [])
  }
}

interface Lane {
  holders: ChainSpecificAddress[]
  delay: number
  targets: ChainSpecificAddress[]
}

function laneOrder(lane: Lane): number {
  return lane.holders.length === 0 ? Number.POSITIVE_INFINITY : lane.delay
}

function laneName(
  lane: Lane,
  byAddress: ReadonlyMap<ChainSpecificAddress, ProjectEntry>,
  displayName: (address: ChainSpecificAddress) => string,
): string {
  if (lane.holders.length === 0) {
    return 'Not upgradeable'
  }
  const holders = lane.holders.map((address) => {
    const entry = byAddress.get(address)
    const name = displayName(address)
    const signers = entry?.signers
    if (signers !== undefined) {
      return `${name} (${signers.threshold}/${signers.members.length})`
    }
    const owner = entry?.controllers[0]
    return owner === undefined
      ? name
      : `${name}, owned by ${displayName(owner)}`
  })
  return `${holders.join(', ')} · ${formatDelay(lane.delay)}`
}

// Names repeat (a ProxyAdmin on each chain, several on one), so a repeated
// name carries what tells it apart; unnamed entries show a short address.
function displayNames(entries: readonly ProjectEntry[]) {
  const counts = new Map<string, number>()
  const count = (key: string) => counts.set(key, (counts.get(key) ?? 0) + 1)
  for (const entry of entries) {
    if (entry.name !== undefined) {
      count(entry.name)
      count(`${ChainSpecificAddress.chain(entry.address)}:${entry.name}`)
    }
  }
  const byAddress = new Map(entries.map((e) => [e.address, e]))
  return (address: ChainSpecificAddress): string => {
    const entry = byAddress.get(address)
    const chain = ChainSpecificAddress.chain(address)
    const raw = ChainSpecificAddress.address(address)
    const short = `${raw.slice(0, 6)}…${raw.slice(-4)}`
    if (entry?.name === undefined) {
      return `${entry?.isEOA ? 'EOA ' : ''}${chain}:${short}`
    }
    const onChain = `${chain}:${entry.name}`
    if ((counts.get(onChain) ?? 0) > 1) return `${onChain} ${short}`
    return (counts.get(entry.name) ?? 0) > 1 ? onChain : entry.name
  }
}

function laneColor(lane: Lane): string {
  if (lane.holders.length === 0) return 'teal'
  if (lane.delay === 0) return 'red'
  return lane.delay < WEEK_SECONDS ? 'orange' : 'green'
}
