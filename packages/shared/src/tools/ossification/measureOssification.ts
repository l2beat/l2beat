import { assert, clamp, type UnixTime } from '@l2beat/shared-pure'
import { knots as EXPLOIT_AGES } from './ossificationCurve.json'
import type {
  OssificationChange,
  OssificationContract,
  OssificationCriticalUpdate,
  OssificationHistory,
  OssificationResult,
} from './types'

const DAY = 24 * 60 * 60
const YEAR = 365 * DAY
const CLUSTER_WINDOW = DAY
const RATE_WINDOW = 3 * YEAR
const RATE_WINDOW_MIN = 30 * DAY

export function measureOssification(
  history: OssificationHistory,
  now: UnixTime,
): OssificationResult {
  assert(history.contracts.length > 0, 'a measured perimeter has a contract')
  const changes = sortedChanges(history)
  const timestamps = changes.map((change) => change.timestamp)

  const launch = getLaunch(history)
  const contracts = getContractClocks(history, launch)
  const projectClockStart = contracts[0].ossifyingSince
  const maturity = history.contracts.every((contract) => contract.isVerified)
    ? exploitAgePercentile(Math.max(0, now - projectClockStart))
    : 0

  const from = Math.max(now - RATE_WINDOW, history.observedSince)
  const windowSeconds = Math.max(now - from, RATE_WINDOW_MIN)
  const clusteredEventCount = clusterStarts(
    timestamps.filter((timestamp) => timestamp >= from),
  ).length

  return {
    score: toDisplayScore(maturity),
    maturity,
    projectClockStart,
    launch,
    lastCriticalChange: timestamps.at(-1),
    criticalChangesPerYear: clusteredEventCount / (windowSeconds / YEAR),
    clusteredEventCount,
    windowSeconds,
    criticalChanges: clusterStarts(timestamps),
    resets: clusterStarts(
      [
        ...timestamps,
        ...history.arrivals.filter((arrival) => arrival > launch),
      ].sort((a, b) => a - b),
    ),
    contracts,
    criticalUpdates: getCriticalUpdates(changes),
  }
}

export function getUncertainNewestChange(
  history: OssificationHistory,
): OssificationChange | undefined {
  const newest = sortedChanges(history).at(-1)
  if (newest === undefined || newest.earliest === newest.timestamp) {
    return undefined
  }
  const [youngest] = getContractClocks(history, getLaunch(history))
  return newest.timestamp === youngest.ossifyingSince ? newest : undefined
}

function sortedChanges(history: OssificationHistory): OssificationChange[] {
  return [...history.changes].sort((a, b) => a.timestamp - b.timestamp)
}

// No clock starts before the launch: older code is only as battle-tested as
// the project that runs it. Youngest clock first, it is the project's.
function getContractClocks(
  history: OssificationHistory,
  launch: number,
): OssificationContract[] {
  return history.contracts
    .map((contract) => ({
      ...contract,
      ossifyingSince: Math.max(contract.ossifyingSince, launch),
    }))
    .sort((a, b) => b.ossifyingSince - a.ossifyingSince)
}

// The perimeter launches with the arrivals of its first day of observation.
// Earlier ones assembled it. A critical change ends the rollout early, so no
// change precedes the launch, and one at the launch only happens when nothing
// older than that change is known.
function getLaunch(history: OssificationHistory): number {
  const firstChange = Math.min(
    ...history.changes.map((change) => change.timestamp),
  )
  const rolloutEnd = history.observedSince + CLUSTER_WINDOW
  const lastRollout = Math.max(
    history.observedSince,
    ...history.arrivals.filter(
      (arrival) => arrival <= rolloutEnd && arrival < firstChange,
    ),
  )
  return Math.min(lastRollout, firstChange)
}

function getCriticalUpdates(
  changes: OssificationChange[],
): OssificationCriticalUpdate[] {
  const updates = new Map<string, OssificationCriticalUpdate>()
  for (const change of changes) {
    if (change.updateId === undefined) continue
    const update = updates.get(change.updateId) ?? {
      id: change.updateId,
      type: 'state',
    }
    if (change.type === 'code') update.type = 'code'
    updates.set(change.updateId, update)
  }
  return [...updates.values()]
}

function clusterStarts(sortedTimestamps: number[]): number[] {
  const starts: number[] = []
  for (const timestamp of sortedTimestamps) {
    const currentStart = starts.at(-1)
    if (
      currentStart === undefined ||
      timestamp - currentStart > CLUSTER_WINDOW
    ) {
      starts.push(timestamp)
    }
  }
  return starts
}

export function exploitAgePercentile(ageSeconds: number): number {
  const n = EXPLOIT_AGES.length
  const p = (i: number) => (i + 1) / (n + 1)

  const i = EXPLOIT_AGES.findIndex((age) => age > ageSeconds)
  if (i === -1) return p(n - 1)
  if (i === 0) return (ageSeconds / EXPLOIT_AGES[0]) * p(0)

  const a = EXPLOIT_AGES[i - 1]
  const b = EXPLOIT_AGES[i]
  return p(i - 1 + (ageSeconds - a) / (b - a))
}

export function toDisplayScore(maturity: number): number {
  return maturity === 0 ? 0 : clamp(Math.round(maturity * 100), 1, 99)
}
