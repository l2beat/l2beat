import {
  type CriticalFlag,
  type DiffHistoryChange,
  type EntryParameters,
  parsePastUpgrades,
  type Upgrade,
} from '@l2beat/discovery'
import { assert, notUndefined, type UnixTime } from '@l2beat/shared-pure'
import type { ProjectOssificationContract } from '../types'
import type { OssificationChange, OssificationInput } from './OssificationInput'
import type { OssificationPatch } from './OssificationPatch'

export interface OssificationSources {
  now: UnixTime
  projectStart?: number
  entries: EntryParameters[]
  overrides: CriticalOverride[]
  changes: DiffHistoryChange[]
  judgement: OssificationJudgement
  patch: OssificationPatch
}

export interface CriticalOverride {
  address: string
  name?: string
  critical: CriticalFlag
}

export interface OssificationJudgement {
  critical(
    address: string,
    template: string | undefined,
  ): CriticalFlag | undefined
  highSeverityFields(
    address: string,
    template: string | undefined,
  ): ReadonlySet<string>
}

interface Member {
  address: string
  name: string
  isVerified: boolean
  deployedAt?: number
  since?: number
  until?: number
  initialization?: Upgrade
  upgrades: Upgrade[]
}

interface MemberEvent {
  type: 'code' | 'state'
  timestamp: number
  earliest?: number
  contract: string
  reviewed: boolean
  updateId?: string
  transaction?: string
}

const key = (address: string) => address.toLowerCase()

export function getOssificationInput(
  sources: OssificationSources,
): OssificationInput | undefined {
  const members = getPerimeter(sources)
  if (members.size === 0) return undefined

  const events = getEvents(sources, members)
  const perimeteredChanges = events.filter((event) =>
    isPerimetered(event, members, sources),
  )
  const contracts = [...members.values()]
    .filter((member) => member.until === undefined)
    .map((member) => toRow(member, events, perimeteredChanges))
  if (contracts.length === 0 || !contracts.every(notUndefined)) {
    return undefined
  }

  return {
    now: sources.now,
    contracts,
    changes: perimeteredChanges.map(toChange),
    resets: [...members.values()]
      .flatMap((m) => [m.deployedAt, m.since])
      .filter(notUndefined),
    observedSince: getObservedSince(members, events, sources.projectStart),
  }
}

function isPerimetered(
  event: MemberEvent,
  members: Map<string, Member>,
  sources: OssificationSources,
): boolean {
  if (event.reviewed) return true
  return (
    isNotBefore(event.timestamp, sources.projectStart) &&
    isNotBefore(event.timestamp, members.get(event.contract)?.since)
  )
}

function toRow(
  member: Member,
  events: MemberEvent[],
  perimetered: MemberEvent[],
): ProjectOssificationContract | undefined {
  const own = (event: MemberEvent) => event.contract === key(member.address)
  const ossifyingSince = latest(
    member.deployedAt,
    ...events.filter(own).map((event) => event.timestamp),
  )
  if (ossifyingSince === undefined) return undefined
  const counted = perimetered.filter(own)
  return {
    name: member.name,
    address: member.address,
    isVerified: member.isVerified,
    ossifyingSince,
    codeChangeCount: counted.filter((event) => event.type === 'code').length,
    stateChangeCount: counted.filter((event) => event.type === 'state').length,
  }
}

function toChange(event: MemberEvent): OssificationChange {
  return {
    timestamp: event.timestamp,
    type: event.type,
    updateId: event.updateId,
    earliest: event.earliest,
  }
}

function getObservedSince(
  members: Map<string, Member>,
  events: MemberEvent[],
  projectStart: number | undefined,
): number {
  const starts = [...members.entries()]
    .map(
      ([address, member]) =>
        latest(member.deployedAt, member.since) ??
        earliest(
          ...events
            .filter((event) => event.contract === address)
            .map((event) => event.timestamp),
        ),
    )
    .filter(notUndefined)
  assert(starts.length > 0, 'a measured perimeter has a known start')
  return Math.max(Math.min(...starts), projectStart ?? Number.NEGATIVE_INFINITY)
}

function getPerimeter(sources: OssificationSources): Map<string, Member> {
  const overrides = new Map(sources.overrides.map((o) => [key(o.address), o]))
  const ignored = new Set(sources.patch.ignoredTransactions.map(key))
  const reviewed = new Set(sources.patch.events.map((e) => key(e.transaction)))
  const members = new Map<string, Member>()

  for (const entry of sources.entries) {
    const address = entry.address.toString()
    const flag = overrides.get(key(address))?.critical ?? entry.critical
    if (flag === undefined) continue
    assert(
      entry.type === 'Contract',
      `${address} is critical but not a contract`,
    )
    const { since, until } = bounds(flag)
    const upgrades = parsePastUpgrades(entry.values?.$pastUpgrades)
      .filter((u) => !has(ignored, u.transaction))
      .filter((u) => until === undefined || u.timestamp <= until)
    const first = upgrades.at(0)
    const initialization =
      first !== undefined && !has(reviewed, first.transaction)
        ? first
        : undefined
    members.set(key(address), {
      address,
      name: entry.name ?? address,
      isVerified: entry.unverified !== true,
      deployedAt: latest(entry.sinceTimestamp, initialization?.timestamp),
      since,
      until,
      initialization,
      upgrades: initialization === undefined ? upgrades : upgrades.slice(1),
    })
  }

  const deleted = sources.changes.filter(
    (change) =>
      change.status === 'deleted' &&
      change.addressType === 'Contract' &&
      !members.has(key(change.address.toString())),
  )
  const deletions = new Map<string, { timestamp: number; template?: string }>()
  for (const change of deleted) {
    const address = key(change.address.toString())
    const seen = deletions.get(address)
    deletions.set(address, {
      timestamp: Math.max(change.timestamp, seen?.timestamp ?? 0),
      template: seen?.template ?? change.template,
    })
  }
  for (const [address, deletion] of deletions) {
    const flag = sources.judgement.critical(address, deletion.template)
    if (flag === undefined) continue
    const { since, until } = bounds(flag)
    members.set(address, {
      address,
      name: address,
      isVerified: true,
      since,
      until: until ?? deletion.timestamp,
      upgrades: [],
    })
  }

  const departed = sources.overrides.filter((o) => !members.has(key(o.address)))
  for (const override of departed) {
    assert(
      override.critical !== true &&
        override.critical.untilTimestamp !== undefined,
      `${override.address} is neither in discovered.json nor deleted in diffHistory.md: bound it with untilTimestamp`,
    )
    members.set(key(override.address), {
      address: override.address,
      name: override.name ?? override.address,
      isVerified: true,
      ...bounds(override.critical),
      upgrades: [],
    })
  }
  return members
}

function bounds(flag: CriticalFlag): { since?: number; until?: number } {
  return flag === true
    ? {}
    : { since: flag.sinceTimestamp, until: flag.untilTimestamp }
}

function getEvents(
  sources: OssificationSources,
  members: Map<string, Member>,
): MemberEvent[] {
  const reviewed: MemberEvent[] = sources.patch.events.map((event) => {
    const member = members.get(key(event.contract))
    assert(
      member !== undefined,
      `reviewed event on ${event.contract}, which is not in the perimeter: mark it critical in config.jsonc`,
    )
    return {
      type: event.type,
      timestamp: event.timestamp,
      earliest: event.timestamp,
      contract: key(member.address),
      reviewed: true,
      transaction: event.transaction.toLowerCase(),
      updateId: event.updateId,
    }
  })
  const reviewedTransactions = transactions(reviewed)
  const upgrades = getUpgradeEvents(members).filter(
    (event) => !has(reviewedTransactions, event.transaction),
  )
  const withHistory = [...members.values()].filter(
    (m) => m.initialization !== undefined || m.upgrades.length > 0,
  )
  const knownTransactions = new Set([
    ...sources.patch.ignoredTransactions.map(key),
    ...reviewedTransactions,
    ...withHistory
      .flatMap((m) => [m.initialization, ...m.upgrades])
      .map((u) => u?.transaction)
      .filter(notUndefined),
  ])
  const upgradeCovered = new Set(withHistory.map((m) => key(m.address)))
  return [
    ...upgrades,
    ...getDiffHistoryEvents(sources, members, reviewed, {
      knownTransactions,
      upgradeCovered,
    }),
    ...reviewed,
  ]
}

const transactions = (events: MemberEvent[]) =>
  new Set(events.map((event) => event.transaction).filter(notUndefined))
const has = (set: ReadonlySet<string>, transaction: string | undefined) =>
  transaction !== undefined && set.has(transaction)

function getUpgradeEvents(members: Map<string, Member>): MemberEvent[] {
  return [...members.values()].flatMap((member) =>
    member.upgrades.map((upgrade) => ({
      type: 'code' as const,
      timestamp: upgrade.timestamp,
      earliest: upgrade.timestamp,
      contract: key(member.address),
      reviewed: false,
      transaction: upgrade.transaction,
    })),
  )
}

function getDiffHistoryEvents(
  sources: OssificationSources,
  members: Map<string, Member>,
  reviewed: MemberEvent[],
  context: {
    knownTransactions: ReadonlySet<string>
    upgradeCovered: ReadonlySet<string>
  },
): MemberEvent[] {
  const superseded = new Set(
    reviewed.flatMap((e) =>
      e.updateId === undefined ? [] : [`${e.updateId} ${e.contract}`],
    ),
  )
  const ignoredUpdates = new Set(sources.patch.ignoredUpdates)
  const blockKey = (change: DiffHistoryChange) =>
    `${change.entryId} ${key(change.address.toString())}`

  const relevant = sources.changes.filter(
    (change) =>
      !ignoredUpdates.has(change.entryId) && !superseded.has(blockKey(change)),
  )
  const blocks = new Map<string, DiffHistoryChange[]>()
  for (const change of relevant) {
    const member = members.get(key(change.address.toString()))
    if (member === undefined) continue
    if (member.until !== undefined && change.timestamp > member.until) continue
    blocks.set(blockKey(change), [
      ...(blocks.get(blockKey(change)) ?? []),
      change,
    ])
  }

  return [...blocks.values()].flatMap((block) =>
    getBlockEvents(block, sources.judgement, context),
  )
}

function getBlockEvents(
  block: DiffHistoryChange[],
  judgement: OssificationJudgement,
  context: {
    knownTransactions: ReadonlySet<string>
    upgradeCovered: ReadonlySet<string>
  },
): MemberEvent[] {
  const first = block[0]
  const contract = key(first.address.toString())
  const base = { contract, reviewed: false, updateId: first.entryId }

  const appended = block.flatMap((change) => change.upgrade ?? [])
  const events: MemberEvent[] = appended
    .filter((upgrade) => !context.knownTransactions.has(upgrade.transaction))
    .map((upgrade) => ({
      ...base,
      type: 'code',
      timestamp: upgrade.timestamp,
      earliest: upgrade.timestamp,
      transaction: upgrade.transaction,
    }))

  const snap = latest(
    ...appended
      .map((upgrade) => upgrade.timestamp)
      .filter((t) => t <= first.timestamp && isNotBefore(t, first.previous)),
  )
  const observed = {
    timestamp: snap ?? first.timestamp,
    earliest: snap ?? first.previous,
  }
  const highFields = judgement.highSeverityFields(
    first.address.toString(),
    first.template,
  )
  if (
    appended.length === 0 &&
    !context.upgradeCovered.has(contract) &&
    block.some((change) => change.kind === 'implementation')
  ) {
    events.push({ ...base, ...observed, type: 'code' })
  }
  if (
    block.some(
      (change) =>
        change.kind === 'value' &&
        change.field !== undefined &&
        highFields.has(change.field),
    )
  ) {
    events.push({ ...base, ...observed, type: 'state' })
  }
  return events
}

function isNotBefore(timestamp: number, bound: number | undefined): boolean {
  return bound === undefined || timestamp >= bound
}

function latest(...values: (number | undefined)[]): number | undefined {
  const known = values.filter(notUndefined)
  return known.length === 0 ? undefined : Math.max(...known)
}

function earliest(...values: (number | undefined)[]): number | undefined {
  const known = values.filter(notUndefined)
  return known.length === 0 ? undefined : Math.min(...known)
}
