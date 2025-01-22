import type { Database } from '@l2beat/database'
import { createTrackedTxId } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import { mockDatabase } from '../../../test/database'
import { findUnusedConfigs } from './findUnusedConfigs'

describe(findUnusedConfigs.name, () => {
  const id1 = createTrackedTxId.random()
  const id2 = createTrackedTxId.random()
  const id3 = createTrackedTxId.random()
  const id4 = createTrackedTxId.random()

  it('should return an array of unused configs', async () => {
    const result = await findUnusedConfigs(
      mockDatabase({
        indexerConfiguration: mockIndexerConfigurationRepository([
          id1,
          id2,
          id3,
          id4,
        ]),
        l2Cost: mockL2CostsRepository([id1]),
        liveness: mockLivenessRepository([id2, id3]),
      }),
    )
    expect(result).toEqual([id4])
  })

  it('should return an empty array when no unused', async () => {
    const result = await findUnusedConfigs(
      mockDatabase({
        indexerConfiguration: mockIndexerConfigurationRepository([
          id1,
          id2,
          id3,
          id4,
        ]),
        l2Cost: mockL2CostsRepository([id1, id4]),
        liveness: mockLivenessRepository([id2, id3]),
      }),
    )
    expect(result).toEqual([])
  })
})

function mockIndexerConfigurationRepository(ids: string[]) {
  return mockObject<Database['indexerConfiguration']>({
    getByIndexerId: mockFn().resolvesTo(ids.map((id) => ({ id }))),
  })
}

function mockLivenessRepository(ids: string[]) {
  return mockObject<Database['liveness']>({
    getUsedConfigsIds: mockFn().resolvesTo(ids),
  })
}

function mockL2CostsRepository(ids: string[]) {
  return mockObject<Database['l2Cost']>({
    getUsedConfigsIds: mockFn().resolvesTo(ids),
  })
}
