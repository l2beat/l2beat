import type { ConfigReader, EntryParameters } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { mockObject } from '@l2beat/test-utils'
import { describe, expect, it, vi } from 'vitest'

import { findUnknownEntries } from './findUnknownEntries'

const A = { address: ChainSpecificAddress.random() }
const B = { address: ChainSpecificAddress.random() }
const C = { address: ChainSpecificAddress.random() }

describe(findUnknownEntries.name, () => {
  it('finds entries not present in discovered.json', () => {
    const configReader = mockObject<ConfigReader>({
      readDiscovery: vi.fn().mockReturnValue({
        entries: [A, B],
      }),
    })

    const entries = [A, B, C] as EntryParameters[]
    const result = findUnknownEntries('', entries, configReader)
    expect(result).toStrictEqual([C.address])
  })

  it('works for empty arrays', () => {
    const configReader = mockObject<ConfigReader>({
      readDiscovery: vi.fn().mockReturnValue({
        entries: [],
      }),
    })

    const entries: EntryParameters[] = []
    const result = findUnknownEntries('', entries, configReader)
    expect(result).toStrictEqual([])
  })
})
