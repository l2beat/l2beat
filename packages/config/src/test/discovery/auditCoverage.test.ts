import { type DiscoveryOutput, get$Implementations } from '@l2beat/discovery'
import { assert } from '@l2beat/shared-pure'
import { expect } from 'earl'
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
      const covered = Object.keys(auditCoverage.contracts).sort()
      expect(covered).toEqual(codeAddresses(discovery))
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
  return [...addresses].sort()
}
