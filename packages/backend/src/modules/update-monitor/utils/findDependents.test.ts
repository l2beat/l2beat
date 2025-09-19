import type { ConfigReader } from '@l2beat/discovery'
import { expect, mockFn, mockObject } from 'earl'
import { findDependents } from './findDependents'

describe(findDependents.name, () => {
  it('correctly returns dependent projects', () => {
    const mockConfigReader = mockObject<ConfigReader>({
      readAllDiscoveredProjects: mockFn().returns([
        'projectA',
        'projectB',
        'projectC',
      ]),
      readDiscovery: mockFn().executes((project: string) => {
        const mockDiscoveries = [
          {
            name: 'projectA',
            entries: [{ name: 'A1', targetProject: 'otherSharedProject' }],
          },
          {
            name: 'projectB',
            entries: [{ name: 'B1', targetProject: 'sharedProject' }],
          },
          { name: 'projectC', entries: [{ name: 'C1' }] },
        ]
        return mockDiscoveries.find((d) => d.name === project)
      }),
    })

    const dependents = findDependents('sharedProject', mockConfigReader)
    expect(dependents).toEqual(['projectB'])
  })
})
