import type { ConfigReader } from '@l2beat/discovery'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { findDependents } from './findDependents'

describe(findDependents.name, () => {
  it('correctly returns dependent projects', () => {
    const mockConfigReader = mockObject<ConfigReader>({
      readAllDiscoveredProjects: vi
        .fn()
        .mockReturnValue(['projectA', 'projectB', 'projectC']),
      readDiscovery: vi.fn().mockImplementation((project: string) => {
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
    expect(dependents).toStrictEqual(['projectB'])
  })
})
