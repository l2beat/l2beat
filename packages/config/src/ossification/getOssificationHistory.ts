import {
  type CriticalFlag,
  type DiffHistoryChange,
  type EntryParameters,
  parsePastUpgrades,
  type Upgrade,
} from '@l2beat/discovery'
import type {
  OssificationChange,
  OssificationContract,
  OssificationHistory,
} from '@l2beat/shared'
import { assert, ChainSpecificAddress, notUndefined } from '@l2beat/shared-pure'
import type { OssificationPatch } from './OssificationPatch'

export interface OssificationSources {
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
  address: ChainSpecificAddress
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
  updateId?: string
  transaction?: string
}

const key = (address: string) => address.toLowerCase()
const upgradeKey = (contract: string, transaction: string | undefined) =>
  transaction === undefined
    ? undefined
    : `${key(contract)} ${transaction.toLowerCase()}`

export function getOssificationHistory(
  sources: OssificationSources,
): OssificationHistory | undefined {
  const members = getPerimeter(sources)
  if (members.size === 0) return undefined

  const events = getEvents(sources, members)
  const countedChanges = events.filter((event) =>
    isCounted(event, members, sources),
  )
  const contracts = [...members.values()]
    .filter((member) => member.until === undefined)
    .map((member) => toRow(member, sources.projectStart, countedChanges))

  return {
    contracts,
    changes: countedChanges.map(toChange),
    deployments: [...members.values()]
      .map((member) => member.deployedAt)
      .filter(notUndefined)
      .sort((a, b) => a - b),
    observedSince: getObservedSince(members, events, sources.projectStart),
  }
}

// Reviewed changes have the same bounds: a review dates a change, it does not
// make an earlier change the project's own.
function isCounted(
  event: MemberEvent,
  members: Map<string, Member>,
  sources: OssificationSources,
): boolean {
  return (
    isNotBefore(event.timestamp, sources.projectStart) &&
    isNotBefore(event.timestamp, members.get(event.contract)?.since)
  )
}

// Before the project start or the moment it became critical, a contract's
// history is not the project's own.
function toRow(
  member: Member,
  projectStart: number | undefined,
  changes: MemberEvent[],
): OssificationContract {
  const counted = changes.filter(
    (event) => event.contract === key(member.address),
  )
  const ossifyingSince = latest(
    member.deployedAt,
    member.since,
    projectStart,
    ...counted.map((event) => event.timestamp),
  )
  assert(
    ossifyingSince !== undefined,
    `${member.address} is critical but has no known age`,
  )
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
  const reviewed = reviewedUpgrades(sources.patch)
  const members = new Map<string, Member>()

  for (const entry of sources.entries) {
    const address = entry.address
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
      first !== undefined &&
      !has(reviewed, upgradeKey(address, first.transaction))
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
  const deletions = new Map<
    string,
    { address: ChainSpecificAddress; timestamp: number; template?: string }
  >()
  for (const change of deleted) {
    const address = key(change.address.toString())
    const seen = deletions.get(address)
    deletions.set(address, {
      address: change.address,
      timestamp: Math.max(change.timestamp, seen?.timestamp ?? 0),
      template: seen?.template ?? change.template,
    })
  }
  for (const [address, deletion] of deletions) {
    const flag = sources.judgement.critical(address, deletion.template)
    if (flag === undefined) continue
    const { since, until } = bounds(flag)
    const created = sources.changes.filter(
      (change) =>
        change.status === 'created' &&
        key(change.address.toString()) === address,
    )
    members.set(address, {
      address: deletion.address,
      name: deletion.address,
      isVerified: true,
      deployedAt: earliest(...created.map((change) => change.timestamp)),
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
    const address = ChainSpecificAddress(override.address)
    members.set(key(address), {
      address,
      name: override.name ?? address,
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
    assert(
      member.until === undefined || event.timestamp <= member.until,
      `reviewed event on ${event.contract} after it left the perimeter: move the event or its untilTimestamp`,
    )
    return {
      type: event.type,
      timestamp: event.timestamp,
      earliest: event.timestamp,
      contract: key(member.address),
      transaction: event.transaction.toLowerCase(),
      updateId: event.updateId,
    }
  })
  const upgrades = getUpgradeEvents(members, reviewedUpgrades(sources.patch))
  const withHistory = [...members.values()].filter(
    (m) => m.initialization !== undefined || m.upgrades.length > 0,
  )
  const knownUpgrades = new Set([
    ...reviewedUpgrades(sources.patch),
    ...withHistory.flatMap((m) =>
      [m.initialization, ...m.upgrades]
        .filter(notUndefined)
        .map((u) => upgradeKey(m.address, u.transaction))
        .filter(notUndefined),
    ),
  ])
  const upgradeCovered = new Set(withHistory.map((m) => key(m.address)))
  return [
    ...upgrades,
    ...getDiffHistoryEvents(sources, members, reviewed, {
      knownUpgrades,
      upgradeCovered,
    }),
    ...reviewed,
  ]
}

const has = (set: ReadonlySet<string>, transaction: string | undefined) =>
  transaction !== undefined && set.has(transaction)
const reviewedUpgrades = (patch: OssificationPatch) =>
  new Set(
    patch.events
      .map((e) => upgradeKey(e.contract, e.transaction))
      .filter(notUndefined),
  )

function getUpgradeEvents(
  members: Map<string, Member>,
  reviewedUpgrades: ReadonlySet<string>,
): MemberEvent[] {
  return [...members.values()].flatMap((member) =>
    member.upgrades
      .filter(
        (u) =>
          !has(reviewedUpgrades, upgradeKey(member.address, u.transaction)),
      )
      .map((upgrade) => ({
        type: 'code' as const,
        timestamp: upgrade.timestamp,
        earliest: upgrade.timestamp,
        contract: key(member.address),
        transaction: upgrade.transaction,
      })),
  )
}

function getDiffHistoryEvents(
  sources: OssificationSources,
  members: Map<string, Member>,
  reviewed: MemberEvent[],
  context: {
    knownUpgrades: ReadonlySet<string>
    upgradeCovered: ReadonlySet<string>
  },
): MemberEvent[] {
  const superseded = new Set(
    reviewed.flatMap((e) =>
      e.updateId === undefined ? [] : [`${e.updateId} ${e.contract}`],
    ),
  )
  const ignoredUpdates = new Set(sources.patch.ignoredUpdates)
  const ignoredTransactions = new Set(
    sources.patch.ignoredTransactions.map(key),
  )
  const blockKey = (change: DiffHistoryChange) =>
    `${change.entryId} ${key(change.address.toString())}`

  const relevant = sources.changes.filter(
    (change) =>
      !ignoredUpdates.has(change.entryId) &&
      !superseded.has(blockKey(change)) &&
      !has(ignoredTransactions, change.upgrade?.transaction),
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
    getBlockEvents(
      block,
      members.get(key(block[0].address.toString())),
      sources.judgement,
      context,
    ),
  )
}

function getBlockEvents(
  block: DiffHistoryChange[],
  member: Member | undefined,
  judgement: OssificationJudgement,
  context: {
    knownUpgrades: ReadonlySet<string>
    upgradeCovered: ReadonlySet<string>
  },
): MemberEvent[] {
  const first = block[0]
  const contract = key(first.address.toString())
  const base = { contract, updateId: first.entryId }

  const appended = block.flatMap((change) => change.upgrade ?? [])
  const events: MemberEvent[] = appended
    .filter(
      (upgrade) =>
        !has(context.knownUpgrades, upgradeKey(contract, upgrade.transaction)),
    )
    .map((upgrade) => ({
      ...base,
      type: 'code',
      timestamp: upgrade.timestamp,
      earliest: upgrade.timestamp,
      transaction: upgrade.transaction,
    }))

  // A new implementation was installed by the contract's newest upgrade before
  // the run. Appended items alone mislead when a diff reshapes $pastUpgrades
  // and shows upgrades of years ago as appended.
  const installing = block.some((change) => change.kind === 'implementation')
    ? [member?.initialization, ...(member?.upgrades ?? [])].filter(notUndefined)
    : []
  const snap = latest(
    ...[...appended, ...installing]
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
