import type { Database } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn, mockObject } from 'earl'
import { getInteropPluginsData } from './getInteropPlugins'

const BASE = UnixTime(1_700_000_000)

describe(getInteropPluginsData.name, () => {
  it('groups types under their plugin, sorted by name', async () => {
    const db = mockObject<Database>({
      interopMessage: mockObject<Database['interopMessage']>({
        getTypeSummary: mockFn().resolvesTo([
          summary('cctp', 'cctp.Message'),
          summary('across', 'across.Message'),
        ]),
      }),
      interopTransfer: mockObject<Database['interopTransfer']>({
        getTypeSummary: mockFn().resolvesTo([
          summary('across', 'across.Transfer.b'),
          summary('across', 'across.Transfer.a'),
        ]),
      }),
    })

    const result = await getInteropPluginsData(db)

    expect(result).toEqual([
      {
        plugin: 'across',
        messageTypes: [expectedSummary('across.Message')],
        transferTypes: [
          expectedSummary('across.Transfer.a'),
          expectedSummary('across.Transfer.b'),
        ],
      },
      {
        plugin: 'cctp',
        messageTypes: [expectedSummary('cctp.Message')],
        transferTypes: [],
      },
    ])
  })

  it('lists a plugin that only has transfers', async () => {
    const db = mockObject<Database>({
      interopMessage: mockObject<Database['interopMessage']>({
        getTypeSummary: mockFn().resolvesTo([]),
      }),
      interopTransfer: mockObject<Database['interopTransfer']>({
        getTypeSummary: mockFn().resolvesTo([
          summary('relay', 'relay.Transfer'),
        ]),
      }),
    })

    const result = await getInteropPluginsData(db)

    expect(result).toEqual([
      {
        plugin: 'relay',
        messageTypes: [],
        transferTypes: [expectedSummary('relay.Transfer')],
      },
    ])
  })

  it('returns an empty list when nothing is retained', async () => {
    const db = mockObject<Database>({
      interopMessage: mockObject<Database['interopMessage']>({
        getTypeSummary: mockFn().resolvesTo([]),
      }),
      interopTransfer: mockObject<Database['interopTransfer']>({
        getTypeSummary: mockFn().resolvesTo([]),
      }),
    })

    expect(await getInteropPluginsData(db)).toEqual([])
  })
})

function summary(plugin: string, type: string) {
  return {
    plugin,
    type,
    count: 3,
    oldestTimestamp: BASE,
    newestTimestamp: BASE + 100,
  }
}

function expectedSummary(type: string) {
  return {
    type,
    count: 3,
    oldestTimestamp: BASE,
    newestTimestamp: BASE + 100,
  }
}
