import type { ConfigReader, EntryParameters } from '@l2beat/discovery'
import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { describe, expect, it, vi } from 'vitest'

import { findUnknownEntries } from './findUnknownEntries'

const A = { address: ChainSpecificAddress.random() }
const B = { address: ChainSpecificAddress.random() }
const C = { address: ChainSpecificAddress.random() }

describe(findUnknownEntries.name, () => {
  it('finds entries not present in discovered.json', () => {
    const configReader = {
      readDiscovery: vi.fn().mockReturnValue({
        entries: [A, B],
      }),
    } as unknown as ConfigReader

    const entries = [A, B, C] as EntryParameters[]
    const result = findUnknownEntries('', entries, configReader)
    expect(result).toEqual([C.address])
  })

  it('works for empty arrays', () => {
    const configReader = {
      readDiscovery: vi.fn().mockReturnValue({
        entries: [],
      }),
    } as unknown as ConfigReader

    const entries: EntryParameters[] = []
    const result = findUnknownEntries('', entries, configReader)
    expect(result).toEqual([])
  })
})
