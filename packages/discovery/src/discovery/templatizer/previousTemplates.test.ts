import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import type { ConfigReader } from '../config/ConfigReader'
import type { DiscoveryOutput, EntryParameters } from '../output/types'
import { readPreviousTemplates } from './previousTemplates'

describe(readPreviousTemplates.name, () => {
  const PROXY = 'eth:0x1111111111111111111111111111111111111111'
  const IMPL = 'eth:0x2222222222222222222222222222222222222222'
  const PLAIN = 'eth:0x3333333333333333333333333333333333333333'

  function reader(discovered: () => DiscoveryOutput): ConfigReader {
    return mockObject<ConfigReader>({ readDiscovery: discovered })
  }

  it('reads each templated entry: its template, the shape names and the failing fields', () => {
    const entries = [
      {
        address: ChainSpecificAddress(PROXY),
        template: 'proj/Registry',
        implementationNames: { [PROXY]: 'Proxy', [IMPL]: 'Registry' },
        errors: { threshold: 'Cannot find a matching method for threshold' },
      },
      {
        address: ChainSpecificAddress(PLAIN),
        template: 'proj/Plain',
        implementationNames: { [PLAIN]: 'Plain' },
      },
      { address: ChainSpecificAddress(IMPL) },
    ] as EntryParameters[]

    expect(
      readPreviousTemplates(
        reader(() => ({ entries }) as DiscoveryOutput),
        'proj',
      ),
    ).toEqual({
      [PROXY]: {
        templateId: 'proj/Registry',
        names: ['Registry'],
        failingFields: ['threshold'],
      },
      [PLAIN]: {
        templateId: 'proj/Plain',
        names: ['Plain'],
        failingFields: [],
      },
    })
  })

  it('has no history for a project discovered for the first time', () => {
    const missing = reader(() => {
      throw Object.assign(new Error('ENOENT: no such file or directory'), {
        code: 'ENOENT',
      })
    })

    expect(readPreviousTemplates(missing, 'proj')).toEqual({})
  })

  it('surfaces a discovered.json that is there but cannot be read, instead of taking it as no history', () => {
    const malformed = reader(() => {
      throw new SyntaxError('Unexpected token } in JSON at position 12')
    })

    expect(() => readPreviousTemplates(malformed, 'proj')).toThrow(
      SyntaxError,
      'Unexpected token } in JSON at position 12',
    )
  })
})
