import type { DiscoveryOutput } from '@l2beat/discovery'
import { assert, type ChainSpecificAddress } from '@l2beat/shared-pure'
import { createHash } from 'crypto'
import type {
  AuditCoverage,
  AuditCoverageHistory,
  AuditCoverageHistoryPoint,
  Unit,
} from './AuditCoverage'
import {
  type AuditedCode,
  auditedCodeAt,
  firstCountedAt,
  reportDates,
} from './AuditedCode'
import type { AuditIndex } from './AuditIndex'
import { coverFlat } from './coverFlat'
import type { DeployedAliases, GetDeployedSource } from './deployedSource'
import { getHistoryPoints, type HistoryPoint } from './historyPoints'
import { RENAMED_LINES_MIN } from './matchDeclaration'
import {
  buildPerimeterTimeline,
  codeAt,
  type PerimeterMember,
  type PerimeterState,
  perimeterAt,
} from './perimeterTimeline'

// The coverage of the perimeter at every point of its history: the code
// deployed then, matched against the reports published by then. See
// README.md, "History".

export interface CoverageHistoryInputs {
  project: string
  index: AuditIndex
  code: AuditedCode
  discovery: DiscoveryOutput
  launch: number | undefined
  /** The main pass's output, which gives the present. */
  coverage: Pick<
    AuditCoverage,
    'contracts' | 'flats' | 'units' | 'discoveredAt'
  >
}

export interface CoverageHistoryStats {
  points: number
  retained: number
  /** Flats matched against a view. */
  covered: number
  /** Flats whose previous result was reused. */
  reused: number
  /** Addresses whose source was read. */
  fetched: number
}

export interface CoverageHistoryLog {
  progress(point: number, count: number, status: string): void
  warn(message: string): void
}

export interface CoverageHistoryResult {
  history: AuditCoverageHistory
  /** Reports referenced by any point, to be listed in the output. */
  reports: Set<string>
  stats: CoverageHistoryStats
}

type Source =
  | { kind: 'flat'; flat: string; hash: string; aliases: DeployedAliases }
  | { kind: 'unverified' | 'non-solidity' }

interface MemberCode {
  member: PerimeterMember
  /** Flat hashes, 'unverified' or 'non-solidity', per code address. */
  sources: string[]
  units: Unit[]
}

interface Evaluated {
  point: HistoryPoint
  members: Map<ChainSpecificAddress, MemberCode>
  numbers: Numbers
}

type Numbers = Pick<
  AuditCoverageHistoryPoint,
  'contracts' | 'withoutSource' | 'units' | 'lines'
>

export async function coverageHistoryOfProject(
  inputs: CoverageHistoryInputs,
  getDeployedSource: GetDeployedSource,
  log: CoverageHistoryLog,
): Promise<CoverageHistoryResult> {
  const { project, index, code, coverage } = inputs
  const timeline = buildPerimeterTimeline(inputs.discovery, inputs.launch)
  for (const warning of timeline.warnings) log.warn(warning)
  const dates = reportDates(index)
  const firstCounted = firstCountedAt(code, dates)
  const now = coverage.discoveredAt
  const points = getHistoryPoints(
    timeline.members,
    timeline.launch,
    dates.values(),
    now,
  )
  const stats: CoverageHistoryStats = {
    points: points.length,
    retained: 0,
    covered: 0,
    reused: 0,
    fetched: 0,
  }

  const sources = new Map<ChainSpecificAddress, Promise<Source>>()
  const getSource = (address: ChainSpecificAddress): Promise<Source> => {
    let source = sources.get(address)
    if (source === undefined) {
      stats.fetched++
      source = getDeployedSource(address).then((deployed) =>
        deployed.kind === 'flat'
          ? {
              kind: 'flat',
              flat: deployed.flat,
              hash: sha256(deployed.flat),
              aliases: deployed.aliases,
            }
          : { kind: deployed.kind },
      )
      sources.set(address, source)
    }
    return source
  }

  // Covering a flat is the expensive step, so a flat keeps its result until
  // a report that can change it is counted, see `affected`.
  const lastCovered = new Map<string, { auditsAt: number; units: Unit[] }>()
  let view: { cutoff: number; code: AuditedCode } | undefined
  const viewAt = (cutoff: number): AuditedCode => {
    if (view === undefined || view.cutoff !== cutoff) {
      view = { cutoff, code: auditedCodeAt(code, index, dates, cutoff) }
    }
    return view.code
  }
  const added = new Map<string, string[]>()
  const addedBetween = (previous: number, cutoff: number): string[] => {
    const key = `${previous} ${cutoff}`
    let objects = added.get(key)
    if (objects === undefined) {
      objects = [...firstCounted]
        .filter(([, at]) => at > previous && at <= cutoff)
        .map(([object]) => object)
      added.set(key, objects)
    }
    return objects
  }
  const inOwnOrLibrary = (object: string): boolean =>
    (code.occurrences.get(object) ?? []).some((occurrence) =>
      occurrence.collections.some(
        (collection) =>
          collection === project || code.libraries.has(collection),
      ),
    )
  const affected = (
    previous: { auditsAt: number; units: Unit[] },
    cutoff: number,
  ): boolean => {
    const objects = addedBetween(previous.auditsAt, cutoff)
    if (objects.length === 0) return false
    const names = new Set(previous.units.map((unit) => unit.name))
    for (const object of objects) {
      for (const name of code.declarationsByObject.get(object)?.keys() ?? []) {
        if (names.has(name)) return true
      }
    }
    const unmatched = previous.units.some(
      (unit) => unit.status === 'none' && unit.lines >= RENAMED_LINES_MIN,
    )
    return unmatched && objects.some(inOwnOrLibrary)
  }
  const coverAt = (source: Source & { kind: 'flat' }, point: HistoryPoint) => {
    const previous = lastCovered.get(source.hash)
    if (previous !== undefined && previous.auditsAt === point.auditsAt) {
      return previous.units
    }
    if (
      previous !== undefined &&
      previous.auditsAt < point.auditsAt &&
      !affected(previous, point.auditsAt)
    ) {
      stats.reused++
      lastCovered.set(source.hash, { ...previous, auditsAt: point.auditsAt })
      return previous.units
    }
    stats.covered++
    const units = coverFlat(
      source.flat,
      source.aliases,
      viewAt(point.auditsAt),
      project,
    ).map((covered) => covered.unit)
    lastCovered.set(source.hash, { auditsAt: point.auditsAt, units })
    return units
  }

  const warned = new Set<string>()
  const evaluate = async (
    point: HistoryPoint,
    state: PerimeterState,
  ): Promise<Evaluated> => {
    const members = new Map<ChainSpecificAddress, MemberCode>()
    for (const member of state.members) {
      const sources: string[] = []
      const units: Unit[] = []
      for (const address of codeAt(member, point.stateAt).addresses) {
        const source = await getSource(address)
        if (source.kind !== 'flat') {
          sources.push(source.kind)
          if (!warned.has(address)) {
            warned.add(address)
            log.warn(
              `${address} of ${member.name} is ${source.kind}: no lines counted while it ran`,
            )
          }
          continue
        }
        sources.push(source.hash)
        units.push(...coverAt(source, point))
      }
      members.set(member.address, { member, sources, units })
    }
    return { point, members, numbers: summarize(members) }
  }

  const present = (point: HistoryPoint, state: PerimeterState): Evaluated => {
    const members = new Map<ChainSpecificAddress, MemberCode>()
    for (const member of state.members) {
      const contract = coverage.contracts[member.address]
      assert(contract !== undefined, `${member.address} is not covered`)
      const sources = [
        contract.source,
        ...Object.values(contract.implementations ?? {}),
      ]
      const units = sources.flatMap((source) =>
        (coverage.flats[source] ?? []).map(([id]) => {
          const unit = coverage.units[id]
          assert(unit !== undefined, `Unknown unit ${id}`)
          return unit
        }),
      )
      members.set(member.address, { member, sources, units })
    }
    return { point, members, numbers: summarize(members) }
  }

  const retained: AuditCoverageHistoryPoint[] = []
  const referencedReports = new Set<string>()
  let undatedReports: string[] = []
  let previous: Evaluated | undefined
  for (const [i, point] of points.entries()) {
    const isPresent = i === points.length - 1
    log.progress(
      i,
      points.length,
      `Covering the perimeter at ${new Date(point.timestamp * 1000).toISOString()}`,
    )
    const state = perimeterAt(timeline.members, point.stateAt)
    const evaluated = isPresent
      ? present(point, state)
      : await evaluate(point, state)
    const referenced = new Set<string>()
    for (const { units } of evaluated.members.values()) {
      for (const unit of units) {
        for (const report of unit.reports ?? []) referenced.add(report)
      }
    }
    const previousAuditsAt =
      previous?.point.auditsAt ?? Number.NEGATIVE_INFINITY
    const reports = [...referenced]
      .filter((report) => {
        const date = dates.get(report)
        return (
          date !== undefined &&
          date > previousAuditsAt &&
          date <= point.auditsAt
        )
      })
      .sort()
    if (isPresent) {
      undatedReports = [...referenced]
        .filter((report) => !dates.has(report))
        .sort()
    }
    const changes = changesSince(previous, evaluated)
    const unchanged =
      previous !== undefined &&
      sameNumbers(previous.numbers, evaluated.numbers) &&
      reports.length === 0 &&
      changes.length === 0
    if (i === 0 || isPresent || !unchanged) {
      for (const report of reports) referencedReports.add(report)
      retained.push({
        timestamp: point.timestamp,
        ...evaluated.numbers,
        ...(reports.length > 0 ? { reports } : {}),
        ...(changes.length > 0 ? { changes } : {}),
      })
    }
    previous = evaluated
  }
  stats.retained = retained.length
  return {
    history: { launch: timeline.launch, points: retained, undatedReports },
    reports: referencedReports,
    stats,
  }
}

function summarize(members: Map<ChainSpecificAddress, MemberCode>): Numbers {
  const numbers: Numbers = {
    contracts: members.size,
    withoutSource: 0,
    units: { identical: 0, differs: 0, none: 0 },
    lines: { total: 0, covered: 0 },
  }
  for (const { sources, units } of members.values()) {
    if (sources.every((source) => !isFlatHash(source))) {
      numbers.withoutSource++
    }
    for (const unit of units) {
      if (unit.kind === 'interface') continue
      numbers.units[unit.status]++
      numbers.lines.total += unit.lines
      numbers.lines.covered += coveredLines(unit)
    }
  }
  return numbers
}

/** The dashboard's rule, see coverageModel.ts in the frontend. */
function coveredLines(unit: Unit): number {
  switch (unit.status) {
    case 'identical':
      return unit.lines
    case 'differs':
      return Math.min(unit.lines, unit.covered ?? 0)
    case 'none':
      return 0
  }
}

function changesSince(
  previous: Evaluated | undefined,
  current: Evaluated,
): NonNullable<AuditCoverageHistoryPoint['changes']> {
  if (previous === undefined) return []
  const changes: NonNullable<AuditCoverageHistoryPoint['changes']> = []
  for (const [address, { member, sources }] of current.members) {
    const before = previous.members.get(address)
    if (before === undefined) {
      changes.push({ address, name: member.name, kind: 'added' })
    } else if (!sameSources(before.sources, sources)) {
      changes.push({ address, name: member.name, kind: 'upgraded' })
    }
  }
  for (const [address, { member }] of previous.members) {
    if (!current.members.has(address)) {
      changes.push({ address, name: member.name, kind: 'removed' })
    }
  }
  return changes.sort((a, b) => a.name.localeCompare(b.name))
}

function sameSources(a: string[], b: string[]): boolean {
  const left = [...a].sort()
  const right = [...b].sort()
  return left.length === right.length && left.every((x, i) => x === right[i])
}

function sameNumbers(a: Numbers, b: Numbers): boolean {
  return (
    a.contracts === b.contracts &&
    a.withoutSource === b.withoutSource &&
    a.units.identical === b.units.identical &&
    a.units.differs === b.units.differs &&
    a.units.none === b.units.none &&
    a.lines.total === b.lines.total &&
    a.lines.covered === b.lines.covered
  )
}

function isFlatHash(source: string): boolean {
  return /^[0-9a-f]{64}$/.test(source)
}

function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex')
}
