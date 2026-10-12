import { type DiscoveryOutput, get$Implementations } from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import { getProjects } from '../../processing/getProjects'
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
  }
})

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
