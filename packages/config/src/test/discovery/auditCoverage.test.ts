import { type DiscoveryOutput, get$Implementations } from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import { getProjects } from '../../processing/getProjects'
import type { ProjectAuditCoverage } from '../../types'
import { discoveryOrUndefined } from './fixtures'

describe('audit-coverage.json', () => {
  for (const project of getProjects()) {
    const auditCoverage = project.auditCoverage
    if (auditCoverage === undefined) {
      continue
    }
    it(`${project.id} covers the contracts discovery found`, () => {
      const discovery = discoveryOrUndefined(project.id)
      assert(discovery !== undefined, `${project.id} has no discovery`)
      const covered = Object.entries(auditCoverage.contracts).flatMap(
        ([address, contract]) => [
          address,
          ...Object.keys(contract.implementations ?? {}),
        ],
      )
      const discovered = codeAddresses(discovery)
      const missing = discovered.filter((a) => !covered.includes(a))
      const extra = covered.filter((a) => !discovered.includes(a))
      assert(
        missing.length === 0 && extra.length === 0,
        [
          `${project.id}/audit-coverage.json is stale, run \`l2b audit-coverage ${project.id}\``,
          ...missing.map((a) => `  not covered: ${a}`),
          ...extra.map((a) => `  no longer discovered: ${a}`),
        ].join('\n'),
      )
    })

    const history = auditCoverage.history
    if (history === undefined) {
      continue
    }
    it(`${project.id} has a consistent coverage history`, () => {
      const { points } = history
      assert(points.length > 0, 'a history has points')
      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1] as (typeof points)[number]
        const b = points[i] as (typeof points)[number]
        assert(a.timestamp < b.timestamp, 'points are strictly ascending')
      }
      assert(points[0]?.timestamp === history.launch, 'starts at the launch')
      const last = points[points.length - 1] as (typeof points)[number]
      assert(last.timestamp === auditCoverage.discoveredAt, 'ends at discovery')
      const present = presentNumbers(auditCoverage)
      assert(
        JSON.stringify({
          contracts: last.contracts,
          withoutSource: last.withoutSource,
          units: last.units,
          lines: last.lines,
        }) === JSON.stringify(present),
        `the last point differs from the dashboard: ${JSON.stringify(last)} vs ${JSON.stringify(present)}`,
      )
      const ids = [
        ...points.flatMap((p) => p.reports ?? []),
        ...history.undatedReports,
      ]
      for (const id of ids) {
        assert(auditCoverage.reports[id] !== undefined, `unknown report ${id}`)
      }
      for (const change of last.changes ?? []) {
        assert(
          change.kind === 'removed' ||
            auditCoverage.contracts[change.address] !== undefined,
          `unknown contract ${change.address}`,
        )
      }
    })
  }
})

/**
 * The dashboard's numbers over its contract selection, as the frontend
 * computes them (coverageModel.ts): interfaces excluded, covered lines are
 * the lines of identical units and the `covered` of differing ones.
 */
function presentNumbers(coverage: ProjectAuditCoverage) {
  const addresses = Object.keys(coverage.contracts)
  const critical = addresses.filter((address) => {
    const value = coverage.contracts[address]?.critical
    return value === true || (value !== undefined && !value.untilTimestamp)
  })
  const selected = critical.length > 0 ? critical : addresses
  const numbers = {
    contracts: selected.length,
    withoutSource: 0,
    units: { identical: 0, differs: 0, none: 0 },
    lines: { total: 0, covered: 0 },
  }
  for (const address of selected) {
    const contract = coverage.contracts[address]
    assert(contract !== undefined)
    const sources = [
      contract.source,
      ...Object.values(contract.implementations ?? {}),
    ]
    if (sources.every((s) => !/^[0-9a-f]{64}$/.test(s))) {
      numbers.withoutSource++
    }
    for (const source of sources) {
      for (const [id] of coverage.flats[source] ?? []) {
        const unit = coverage.units[id]
        assert(unit !== undefined)
        if (unit.kind === 'interface') continue
        numbers.units[unit.status]++
        numbers.lines.total += unit.lines
        numbers.lines.covered +=
          unit.status === 'identical'
            ? unit.lines
            : unit.status === 'differs'
              ? Math.min(unit.lines, unit.covered ?? 0)
              : 0
      }
    }
  }
  return numbers
}

function codeAddresses(discovery: DiscoveryOutput): string[] {
  const addresses = new Set<string>()
  for (const entry of discovery.entries) {
    if (entry.type !== 'Contract') {
      continue
    }
    addresses.add(entry.address)
    for (const implementation of get$Implementations(entry.values)) {
      addresses.add(implementation)
    }
  }
  return [...addresses]
}
