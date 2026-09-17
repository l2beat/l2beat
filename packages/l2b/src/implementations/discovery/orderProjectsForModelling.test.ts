import type { DiscoveryOutput } from '@l2beat/discovery'
import { ChainSpecificAddress, Hash256 } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { orderProjectsForModelling } from './orderProjectsForModelling'

describe(orderProjectsForModelling.name, () => {
  it('orders a diamond and disconnected projects deterministically, with duplicate references', () => {
    const discoveries = [
      discovery('a', ['b', 'c', 'b']),
      discovery('b', ['d']),
      discovery('c', ['d']),
      discovery('d'),
      discovery('e'),
    ]
    expect(orderProjectsForModelling(discoveries)).toEqual([
      'd',
      'b',
      'c',
      'a',
      'e',
    ])
    expect(orderProjectsForModelling(discoveries.reverse())).toEqual([
      'd',
      'b',
      'c',
      'a',
      'e',
    ])
  })

  it('reports unresolved projects when references form a cycle', () => {
    expect(() =>
      orderProjectsForModelling([
        discovery('consumer', ['a']),
        discovery('a', ['b']),
        discovery('b', ['a']),
        discovery('independent'),
      ]),
    ).toThrow(
      'Cannot order projects for modelling: a, b, consumer. Check for cyclic references.',
    )
  })

  it('reports a missing dependency', () => {
    expect(() =>
      orderProjectsForModelling([discovery('a', ['missing'])]),
    ).toThrow('Missing discovery missing, referenced by a.')
  })
})

function discovery(name: string, references: string[] = []): DiscoveryOutput {
  return {
    name,
    timestamp: 0,
    configHash: Hash256.ZERO,
    abis: {},
    usedTemplates: {},
    usedBlockNumbers: {},
    modelledAgainst: {},
    entries: references.map((targetProject, i) => ({
      type: 'Reference',
      targetProject,
      address: ChainSpecificAddress.from('eth', `0x${i + 1}`),
    })),
  }
}
