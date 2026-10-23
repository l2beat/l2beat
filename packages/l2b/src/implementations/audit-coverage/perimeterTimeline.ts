import {
  type DiscoveryOutput,
  type EntryParameters,
  get$Implementations,
} from '@l2beat/discovery'
import { assert, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'

// The contracts the audits dashboard shows, over time: which contracts were
// in the perimeter at a moment and which code each one ran. Reconstructed
// from discovery's current output alone: the critical windows and the
// implementation history (`$pastUpgrades`) of every contract.

export interface CodeInterval {
  /** The addresses are in force from this moment on. */
  from: number
  /** The member's own address, then its implementations at the time. */
  addresses: ChainSpecificAddress[]
}

export interface PerimeterMember {
  address: ChainSpecificAddress
  name: string
  /** Latest of deployment, critical since and launch. */
  since: number
  /** Critical until; undefined while a member. */
  until?: number
  /** Ascending; the first starts at `since`. */
  code: CodeInterval[]
}

/**
 * Contracts deployed within this window after the launch belong to the
 * launch rollout and are members from the launch, as ossification places its
 * genesis at the rollout's last deployment. Without this, a project launched
 * in the morning and completed in the afternoon starts with two points.
 */
const ROLLOUT_WINDOW = UnixTime.DAY

export interface PerimeterTimeline {
  launch: number
  members: PerimeterMember[]
  warnings: string[]
}

export interface PerimeterState {
  members: PerimeterMember[]
  /** Deduplicated code addresses of the members. */
  addresses: ChainSpecificAddress[]
}

export interface PastUpgrade {
  timestamp: number
  transaction?: string
  implementations: ChainSpecificAddress[]
}

/**
 * The members of the perimeter and the code of each over time. Without a
 * launch the series starts at the earliest member.
 */
export function buildPerimeterTimeline(
  discovery: DiscoveryOutput,
  launch: number | undefined,
): PerimeterTimeline {
  const warnings: string[] = []
  const entries = discovery.entries.filter((e) => e.type === 'Contract')
  const critical = entries.filter((e) => e.critical !== undefined)
  const selected = critical.length > 0 ? critical : entries
  const drafts = selected.map((entry) => toDraft(entry, warnings))
  const starts = drafts.map((d) => d.since).filter(isDefined)
  assert(
    launch !== undefined || starts.length > 0,
    `${discovery.name}: no member has a known start, pass a launch`,
  )
  const start = launch ?? Math.min(...starts)
  const members = drafts.flatMap((draft) => {
    const own = Math.max(draft.since ?? start, start)
    const rollout = own <= start + ROLLOUT_WINDOW
    const since = rollout ? start : own
    if (draft.until !== undefined && draft.until <= since) return []
    // A rollout member runs, from the launch, the code it had at the end of
    // the rollout: its proxies were deployed and initialized minutes apart.
    const [first, ...rest] = collapse(
      draft.code,
      rollout ? start + ROLLOUT_WINDOW : own,
    )
    return [
      {
        address: draft.address,
        name: draft.name,
        since,
        ...(draft.until === undefined ? {} : { until: draft.until }),
        code: [{ from: since, addresses: first.addresses }, ...rest],
      },
    ]
  })
  members.sort((a, b) => a.since - b.since || (a.address < b.address ? -1 : 1))
  return { launch: start, members, warnings }
}

/** The perimeter at `t`: members since (inclusive) and until (exclusive). */
export function perimeterAt(
  members: PerimeterMember[],
  t: number,
): PerimeterState {
  const present = members.filter(
    (m) => m.since <= t && (m.until === undefined || t < m.until),
  )
  const addresses = new Set<ChainSpecificAddress>()
  for (const member of present) {
    for (const address of codeAt(member, t).addresses) {
      addresses.add(address)
    }
  }
  return { members: present, addresses: [...addresses] }
}

/** The code a member ran at `t`; `t` is not before `since`. */
export function codeAt(member: PerimeterMember, t: number): CodeInterval {
  let current: CodeInterval | undefined
  for (const interval of member.code) {
    if (interval.from > t) break
    current = interval
  }
  assert(current !== undefined, `${member.address} has no code at ${t}`)
  return current
}

/**
 * `$pastUpgrades` with the implementations each one installed, ascending.
 * A transaction that upgraded several times (the OP Contracts Manager sets
 * an intermediate implementation before the final one) keeps its last
 * record, the implementations it left behind. Items that do not parse are
 * skipped.
 */
export function parsePastUpgrades(value: unknown): PastUpgrade[] {
  if (!Array.isArray(value)) return []
  const byTransaction = new Map<string, number>()
  const upgrades: PastUpgrade[] = []
  for (const item of value) {
    if (!Array.isArray(item) || typeof item[0] !== 'string') continue
    const parsed = Date.parse(item[0])
    if (!Number.isFinite(parsed)) continue
    const timestamp = Math.floor(parsed / 1000)
    const transaction =
      typeof item[1] === 'string' && item[1] !== ''
        ? item[1].toLowerCase()
        : undefined
    const implementations = Array.isArray(item[2])
      ? item[2]
          .filter((i): i is string => typeof i === 'string')
          .map((i) => ChainSpecificAddress(i))
      : []
    const upgrade = { timestamp, transaction, implementations }
    const earlier =
      transaction === undefined ? undefined : byTransaction.get(transaction)
    if (earlier !== undefined) {
      upgrades[earlier] = upgrade
      continue
    }
    if (transaction !== undefined) {
      byTransaction.set(transaction, upgrades.length)
    }
    upgrades.push(upgrade)
  }
  return upgrades.sort((a, b) => a.timestamp - b.timestamp)
}

interface Draft {
  address: ChainSpecificAddress
  name: string
  since: number | undefined
  until: number | undefined
  code: CodeInterval[]
}

function toDraft(entry: EntryParameters, warnings: string[]): Draft {
  const address = entry.address
  const name = entry.name ?? address
  const upgrades = parsePastUpgrades(entry.values?.$pastUpgrades)
  const deployedAt = entry.sinceTimestamp ?? upgrades[0]?.timestamp
  if (deployedAt === undefined) {
    warnings.push(
      `${name} (${address}) has no deployment time: a member from the launch`,
    )
  }
  const flag = entry.critical
  const window: { sinceTimestamp?: number; untilTimestamp?: number } =
    flag === true || flag === undefined ? {} : flag
  const since = latest(deployedAt, window.sinceTimestamp)
  const code: CodeInterval[] = [
    { from: deployedAt ?? Number.NEGATIVE_INFINITY, addresses: [address] },
    ...upgrades.map((u) => ({
      from: u.timestamp,
      addresses: [address, ...u.implementations],
    })),
  ]
  const current = [address, ...get$Implementations(entry.values)]
  const last = code[code.length - 1] as CodeInterval
  if (!sameAddresses(last.addresses, current)) {
    if (upgrades.length > 0) {
      warnings.push(
        `${name} (${address}): the recorded upgrades end at ${last.addresses
          .slice(1)
          .join(', ')} but the current implementations are ${current
          .slice(1)
          .join(', ')}: assumed current since the last recorded upgrade`,
      )
    }
    last.addresses = current
  }
  return { address, name, since, until: window.untilTimestamp, code }
}

/** Intervals up to `since` collapse into the one in force at `since`. */
function collapse(
  code: CodeInterval[],
  since: number,
): [CodeInterval, ...CodeInterval[]] {
  const before = code.filter((c) => c.from <= since)
  const after = code.filter((c) => c.from > since)
  const inForce = before[before.length - 1]
  assert(inForce !== undefined, 'a member has code at its start')
  return [{ from: since, addresses: inForce.addresses }, ...after]
}

function sameAddresses(
  a: ChainSpecificAddress[],
  b: ChainSpecificAddress[],
): boolean {
  const left = [...new Set(a.map((x) => x.toLowerCase()))].sort()
  const right = [...new Set(b.map((x) => x.toLowerCase()))].sort()
  return left.length === right.length && left.every((x, i) => x === right[i])
}

function latest(...values: (number | undefined)[]): number | undefined {
  const known = values.filter(isDefined)
  return known.length === 0 ? undefined : Math.max(...known)
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined
}
