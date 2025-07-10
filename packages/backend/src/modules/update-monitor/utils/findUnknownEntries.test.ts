import type { ConfigReader, EntryParameters } from '@l2beat/discovery'
import { EthereumAddress, fromParts, rawAddress } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'

import { findUnknownEntries } from './findUnknownEntries'

const A = { address: fromParts('eth', EthereumAddress.random()) }
const B = { address: fromParts('eth', EthereumAddress.random()) }
const C = { address: fromParts('eth', EthereumAddress.random()) }

describe(findUnknownEntries.name, () => {
  it('finds entries not present in discovered.json', () => {
    const configReader = mockObject<ConfigReader>({
      readDiscovery: mockFn().returns({
        entries: [A, B],
      }),
    })

    const entries = [A, B, C] as EntryParameters[]
    const result = findUnknownEntries('', entries, configReader, 'ethereum')
    expect(result).toEqual([rawAddress(C.address)])
  })

  it('works for empty arrays', () => {
    const configReader = mockObject<ConfigReader>({
      readDiscovery: mockFn().returns({
        entries: [],
      }),
    })

    const entries: EntryParameters[] = []
    const result = findUnknownEntries('', entries, configReader, 'ethereum')
    expect(result).toEqual([])
  })
})
