import { assert, clamp, type UnixTime } from '@l2beat/shared-pure'
import { knots as EXPLOIT_AGES } from './ossificationCurve.json'
import type {
  OssificationChange,
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
  const genesis = getGenesis(history)
  const clockStart = Math.max(genesis, ...timestamps)

  const isVerified = history.contracts.every((contract) => contract.isVerified)
  const score = isVerified
    ? toDisplayScore(exploitAgePercentile(Math.max(0, now - clockStart)))
    : 0

  const from = Math.max(now - RATE_WINDOW, genesis)
  const clusteredEventCount = clusterStarts(
    timestamps.filter((timestamp) => timestamp >= from),
  ).length
  const years = Math.max(now - from, RATE_WINDOW_MIN) / YEAR

  return {
    score,
    clockStart,
    genesis,
    criticalChangesPerYear: clusteredEventCount / years,
    clusteredEventCount,
    criticalChanges: clusterStarts(timestamps),
    contracts: history.contracts
      .map((contract) => ({
        ...contract,
        ossifyingSince: Math.max(contract.ossifyingSince, genesis),
      }))
      .sort((a, b) => b.ossifyingSince - a.ossifyingSince),
    criticalUpdates: getCriticalUpdates(changes),
  }
}

/** The newest change starts the clock, so it must be dated exactly. */
export function getUncertainNewestChange(
  history: OssificationHistory,
): OssificationChange | undefined {
  const newest = sortedChanges(history).at(-1)
  return newest !== undefined && newest.earliest !== newest.timestamp
    ? newest
    : undefined
}

function sortedChanges(history: OssificationHistory): OssificationChange[] {
  return [...history.changes].sort((a, b) => a.timestamp - b.timestamp)
}

// The last deployment in the first day of observation, or the first change if
// it comes sooner. Earlier deployments only assembled the perimeter.
function getGenesis(history: OssificationHistory): number {
  const firstChange = Math.min(
    ...history.changes.map((change) => change.timestamp),
  )
  const rollout = history.deployments.filter(
    (deployment) =>
      deployment <= history.observedSince + CLUSTER_WINDOW &&
      deployment < firstChange,
  )
  return Math.min(Math.max(history.observedSince, ...rollout), firstChange)
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
