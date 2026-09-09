import { assert, clamp } from '@l2beat/shared-pure'
import type {
  ProjectOssification,
  ProjectOssificationCriticalUpdate,
} from '../types'
import type { OssificationChange, OssificationInput } from './OssificationInput'
import { knots as EXPLOIT_AGES } from './ossificationCurve.json'

const DAY = 24 * 60 * 60
const YEAR = 365 * DAY
const CLUSTER_WINDOW = DAY
const RATE_WINDOW = 3 * YEAR
const RATE_WINDOW_MIN = 30 * DAY

export function measureOssification(
  input: OssificationInput,
): ProjectOssification {
  assert(input.contracts.length > 0, 'a measured perimeter has a contract')
  const changes = sortedChanges(input)
  const timestamps = changes.map((change) => change.timestamp)

  const projectClockStart = getProjectClockStart(input)
  const maturity = input.contracts.every((contract) => contract.isVerified)
    ? exploitAgePercentile(Math.max(0, input.now - projectClockStart))
    : 0

  const from = Math.max(input.now - RATE_WINDOW, input.observedSince)
  const windowSeconds = Math.max(input.now - from, RATE_WINDOW_MIN)
  const clusteredEventCount = clusterStarts(timestamps).filter(
    (start) => start >= from,
  ).length

  return {
    score: toDisplayScore(maturity),
    maturity,
    projectClockStart,
    lastCriticalChange: timestamps.at(-1),
    criticalChangesPerYear: clusteredEventCount / (windowSeconds / YEAR),
    clusteredEventCount,
    windowSeconds,
    perimeterResets: clusterStarts(
      [...timestamps, ...input.resets].sort((a, b) => a - b),
    ),
    contracts: [...input.contracts].sort(
      (a, b) => b.ossifyingSince - a.ossifyingSince,
    ),
    criticalUpdates: getCriticalUpdates(changes),
  }
}

export function getUncertainNewestChange(
  input: OssificationInput,
): OssificationChange | undefined {
  const newest = sortedChanges(input).at(-1)
  if (newest === undefined || newest.earliest === newest.timestamp) {
    return undefined
  }
  return newest.timestamp === getProjectClockStart(input) ? newest : undefined
}

function sortedChanges(input: OssificationInput): OssificationChange[] {
  return [...input.changes].sort((a, b) => a.timestamp - b.timestamp)
}

function getProjectClockStart(input: OssificationInput): number {
  return Math.max(...input.contracts.map((contract) => contract.ossifyingSince))
}

function getCriticalUpdates(
  changes: OssificationChange[],
): ProjectOssificationCriticalUpdate[] {
  const updates = new Map<string, ProjectOssificationCriticalUpdate>()
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
