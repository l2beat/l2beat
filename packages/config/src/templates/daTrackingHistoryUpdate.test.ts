import { ProjectId } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { ProjectDaTrackingConfig } from '../types'
import type { DaTrackingHistoryFile } from './daTrackingHistory'
import { daTrackingId } from './daTrackingHistory'
import type { EraBoundary } from './daTrackingHistoryUpdate'
import { dropLastEra, updateDaTrackingHistory } from './daTrackingHistoryUpdate'

const DERIVED_A: ProjectDaTrackingConfig = {
  type: 'ethereum',
  daLayer: ProjectId('ethereum'),
  inbox: '0xInbox',
  sequencers: ['0xSequencerA'],
  sinceBlock: 1_000_000,
}

const DERIVED_B: ProjectDaTrackingConfig = {
  ...DERIVED_A,
  sequencers: ['0xSequencerB'],
}

const BOUNDARY: EraBoundary = {
  sinceBlock: 2_000_000,
  untilBlock: 2_000_500,
  precision: 'bracketed',
  observedAtTimestamp: 1784282781,
}

const resolveBoundary = () => Promise.resolve(BOUNDARY)
const failBoundary = (): Promise<EraBoundary> => {
  throw new Error('boundary resolution should not be needed')
}

describe(updateDaTrackingHistory.name, () => {
  it('initializes a file with the derived open era', async () => {
    const result = await updateDaTrackingHistory(
      'test',
      undefined,
      [DERIVED_A],
      failBoundary,
    )
    expect(result.file).toEqual({
      eras: [
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: '0xInbox',
          sequencers: ['0xSequencerA'],
          sinceBlock: 1_000_000,
        },
      ],
    })
    expect(result.changes.length).toEqual(1)
  })

  it('returns no file when nothing is derivable', async () => {
    const result = await updateDaTrackingHistory(
      'test',
      undefined,
      [],
      failBoundary,
    )
    expect(result.file).toEqual(undefined)
    expect(result.changes).toEqual([])
  })

  it('is a no-op when the open era matches the derivation', async () => {
    const { file: initial } = await updateDaTrackingHistory(
      'test',
      undefined,
      [DERIVED_A],
      failBoundary,
    )
    // Derived sinceBlock differs (deployment block vs stored value) - only
    // identity matters for the match.
    const result = await updateDaTrackingHistory(
      'test',
      initial,
      [{ ...DERIVED_A, sinceBlock: 42 }],
      failBoundary,
    )
    expect(result.file).toEqual(initial)
    expect(result.changes).toEqual([])
  })

  it('closes the old era and appends the new one on rotation', async () => {
    const { file: initial } = await updateDaTrackingHistory(
      'test',
      undefined,
      [DERIVED_A],
      failBoundary,
    )
    const result = await updateDaTrackingHistory(
      'test',
      initial,
      [DERIVED_B],
      resolveBoundary,
    )
    expect(result.file).toEqual({
      eras: [
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: '0xInbox',
          sequencers: ['0xSequencerA'],
          sinceBlock: 1_000_000,
          untilBlock: BOUNDARY.untilBlock,
          closed: {
            reason: 'sequencers changed',
            observedAtTimestamp: BOUNDARY.observedAtTimestamp,
            precision: 'bracketed',
          },
        },
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: '0xInbox',
          sequencers: ['0xSequencerB'],
          sinceBlock: BOUNDARY.sinceBlock,
        },
      ],
    })
    expect(result.changes.length).toEqual(2)
  })

  it('adds a discriminator when the identity repeats an earlier era (A->B->A)', async () => {
    const { file: withA } = await updateDaTrackingHistory(
      'test',
      undefined,
      [DERIVED_A],
      failBoundary,
    )
    const { file: withB } = await updateDaTrackingHistory(
      'test',
      withA,
      [DERIVED_B],
      resolveBoundary,
    )
    const laterBoundary: EraBoundary = {
      sinceBlock: 3_000_000,
      untilBlock: 3_000_500,
      precision: 'bracketed',
    }
    const result = await updateDaTrackingHistory(
      'test',
      withB,
      [DERIVED_A],
      () => Promise.resolve(laterBoundary),
    )
    const eras = result.file?.eras ?? []
    expect(eras.length).toEqual(3)
    expect(eras[2].discriminator).toEqual('1')
    // Distinct backend configuration ids despite identical identity fields
    expect(daTrackingId(eras[2])).not.toEqual(daTrackingId(eras[0]))
    expect(result.changes.some((c) => c.includes('discriminator'))).toEqual(
      true,
    )
  })

  it('keeps the template sinceBlock when switching to a new layer and closes the abandoned one', async () => {
    const { file: initial } = await updateDaTrackingHistory(
      'test',
      undefined,
      [DERIVED_A],
      failBoundary,
    )
    const celestia: ProjectDaTrackingConfig = {
      type: 'celestia',
      daLayer: ProjectId('celestia'),
      namespace: 'ns',
      sinceBlock: 555,
    }
    const result = await updateDaTrackingHistory(
      'test',
      initial,
      [celestia],
      resolveBoundary,
    )
    const eras = result.file?.eras ?? []
    expect(eras.length).toEqual(2)
    // Old ethereum era closed because its group is no longer derived
    expect(eras[0].untilBlock).toEqual(BOUNDARY.untilBlock)
    expect(eras[0].closed?.reason).toEqual('no longer derived from discovery')
    // Celestia blocks live on a different chain - template sinceBlock kept
    expect(eras[1].sinceBlock).toEqual(555)
    expect(eras[1].untilBlock).toEqual(undefined)
  })

  it('rejects eigen-da derivations', async () => {
    const eigen: ProjectDaTrackingConfig = {
      type: 'eigen-da',
      daLayer: ProjectId('eigen-da'),
      customerId: '0xc',
      sinceTimestamp: 123,
    }
    await expect(() =>
      updateDaTrackingHistory('test', undefined, [eigen], failBoundary),
    ).toBeRejected()
  })
})

describe(dropLastEra.name, () => {
  it('drops the last era and reopens the previous one of the group', async () => {
    const { file: withA } = await updateDaTrackingHistory(
      'test',
      undefined,
      [DERIVED_A],
      failBoundary,
    )
    const { file: withB } = await updateDaTrackingHistory(
      'test',
      withA,
      [DERIVED_B],
      resolveBoundary,
    )
    expect(withB).not.toEqual(undefined)
    if (!withB) return
    const result = dropLastEra(withB)
    expect(result.file).toEqual(withA)
    expect(result.changes.length).toEqual(2)
  })

  it('deletes the file when the last era is dropped', () => {
    const file: DaTrackingHistoryFile = {
      eras: [
        {
          type: 'ethereum',
          daLayer: 'ethereum',
          inbox: '0xInbox',
          sinceBlock: 1,
        },
      ],
    }
    const result = dropLastEra(file)
    expect(result.file).toEqual(undefined)
  })
})
