import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { DaTrackingEra } from './daTrackingHistory'
import {
  daTrackingId,
  daTrackingIdentity,
  eraToConfig,
  parseDaTrackingHistory,
  serializeDaTrackingHistory,
} from './daTrackingHistory'

const OLD_ERA: DaTrackingEra = {
  type: 'ethereum',
  daLayer: 'ethereum',
  inbox: '0x00f9BCEe08DCe4F0e7906c1f6cFb10c77802EEd0',
  sequencers: ['0x2b8733E8c60A928b19BB7db1D79b918e8E09AC8c'],
  sinceBlock: 21169100,
  untilBlock: 24776391,
  closed: {
    reason: 'SystemConfig.batcherHash changed',
    observedAtTimestamp: 1784282781,
    precision: 'exact',
  },
}

const NEW_ERA: DaTrackingEra = {
  type: 'ethereum',
  daLayer: 'ethereum',
  inbox: '0x00f9BCEe08DCe4F0e7906c1f6cFb10c77802EEd0',
  sequencers: ['0x47827645bA78EB18c3d64Fe2146EfdE66F74894B'],
  sinceBlock: 24776391,
}

describe(parseDaTrackingHistory.name, () => {
  it('accepts a chained two-era file', () => {
    const file = parseDaTrackingHistory({ eras: [OLD_ERA, NEW_ERA] }, 'test')
    expect(file.eras.length).toEqual(2)
  })

  it('accepts a single open era (init state)', () => {
    const file = parseDaTrackingHistory({ eras: [NEW_ERA] }, 'test')
    expect(file.eras[0].untilBlock).toEqual(undefined)
  })

  it('accepts a fully closed history (archived project)', () => {
    const file = parseDaTrackingHistory({ eras: [OLD_ERA] }, 'test')
    expect(file.eras.length).toEqual(1)
  })

  it('accepts overlapping eras with distinct identities (bracketed boundary)', () => {
    const overlapping = { ...NEW_ERA, sinceBlock: 24776000 }
    const file = parseDaTrackingHistory(
      { eras: [OLD_ERA, overlapping] },
      'test',
    )
    expect(file.eras.length).toEqual(2)
  })

  it('rejects malformed json', () => {
    expect(() =>
      parseDaTrackingHistory({ eras: [{ type: 'x' }] }, 'test'),
    ).toThrow()
    expect(() => parseDaTrackingHistory({}, 'test')).toThrow()
  })

  it('rejects an empty era list', () => {
    expect(() => parseDaTrackingHistory({ eras: [] }, 'test')).toThrow(
      /must not be empty/,
    )
  })

  it('rejects an open era before a later era in the same group', () => {
    const open = { ...OLD_ERA, untilBlock: undefined, closed: undefined }
    expect(() =>
      parseDaTrackingHistory({ eras: [open, NEW_ERA] }, 'test'),
    ).toThrow(/only the last era of a group may be open/)
  })

  it('rejects untilBlock before sinceBlock', () => {
    const inverted = { ...OLD_ERA, untilBlock: OLD_ERA.sinceBlock - 1 }
    expect(() => parseDaTrackingHistory({ eras: [inverted] }, 'test')).toThrow(
      /untilBlock/,
    )
  })

  it('rejects a closed era without closed metadata', () => {
    const { closed: _closed, ...bare } = OLD_ERA
    expect(() => parseDaTrackingHistory({ eras: [bare] }, 'test')).toThrow(
      /no closed metadata/,
    )
  })

  it('rejects an open era with closed metadata', () => {
    const open = { ...NEW_ERA, closed: OLD_ERA.closed }
    expect(() => parseDaTrackingHistory({ eras: [open] }, 'test')).toThrow(
      /open .* closed metadata/,
    )
  })

  it('rejects descending sinceBlock within a group', () => {
    const later = {
      ...OLD_ERA,
      sequencers: ['0xaaa'],
      sinceBlock: OLD_ERA.sinceBlock - 100,
      untilBlock: OLD_ERA.sinceBlock,
    }
    expect(() =>
      parseDaTrackingHistory({ eras: [OLD_ERA, later] }, 'test'),
    ).toThrow(/ascending order/)
  })

  it('rejects two eras with identical id (missing discriminator)', () => {
    const resumed = {
      ...OLD_ERA,
      sinceBlock: 30000000,
      untilBlock: undefined,
      closed: undefined,
    }
    expect(() =>
      parseDaTrackingHistory({ eras: [OLD_ERA, resumed] }, 'test'),
    ).toThrow(/needs a discriminator/)
  })

  it('accepts an A->B->A history when the repeat era has a discriminator', () => {
    const resumed = {
      ...OLD_ERA,
      sinceBlock: 30000000,
      untilBlock: undefined,
      closed: undefined,
      discriminator: '1',
    }
    const file = parseDaTrackingHistory(
      { eras: [OLD_ERA, { ...NEW_ERA, ...closedAt(30000000) }, resumed] },
      'test',
    )
    expect(file.eras.length).toEqual(3)
    expect(daTrackingId(file.eras[2])).not.toEqual(daTrackingId(file.eras[0]))
    expect(daTrackingIdentity(file.eras[2])).toEqual(
      daTrackingIdentity(file.eras[0]),
    )
  })

  it('rejects same-identity eras with overlapping ranges even with discriminators', () => {
    const resumed = {
      ...OLD_ERA,
      sinceBlock: OLD_ERA.untilBlock ?? 0, // shares the boundary block
      untilBlock: undefined,
      closed: undefined,
      discriminator: '1',
    }
    expect(() =>
      parseDaTrackingHistory({ eras: [OLD_ERA, resumed] }, 'test'),
    ).toThrow(/identical identities must be disjoint/)
  })
})

describe(eraToConfig.name, () => {
  it('drops metadata and keeps the discriminator', () => {
    const config = eraToConfig({ ...OLD_ERA, discriminator: '1' })
    expect('closed' in config).toEqual(false)
    expect(config).toEqual({
      type: 'ethereum',
      daLayer: ProjectId('ethereum'),
      inbox: OLD_ERA.inbox,
      sequencers: OLD_ERA.sequencers,
      sinceBlock: OLD_ERA.sinceBlock,
      untilBlock: OLD_ERA.untilBlock,
      discriminator: '1',
    })
  })
})

describe(serializeDaTrackingHistory.name, () => {
  it('round-trips through the parser with stable key order', () => {
    // Scrambled input key order must not affect the serialized output
    const scrambled = {
      sinceBlock: NEW_ERA.sinceBlock,
      sequencers: NEW_ERA.sequencers,
      type: NEW_ERA.type,
      daLayer: NEW_ERA.daLayer,
      inbox: NEW_ERA.inbox,
    } as DaTrackingEra
    const serialized = serializeDaTrackingHistory({
      eras: [OLD_ERA, scrambled],
    })
    expect(serialized).toEqual(
      serializeDaTrackingHistory(
        parseDaTrackingHistory(JSON.parse(serialized), 'test'),
      ),
    )
    const keys = Object.keys(JSON.parse(serialized).eras[1])
    expect(keys).toEqual([
      'type',
      'daLayer',
      'inbox',
      'sequencers',
      'sinceBlock',
    ])
  })
})

function closedAt(untilBlock: number) {
  return {
    untilBlock,
    closed: {
      reason: 'test',
      precision: 'manual' as const,
    },
  }
}
