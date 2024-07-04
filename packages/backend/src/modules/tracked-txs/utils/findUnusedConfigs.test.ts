import { createTrackedTxId } from '@l2beat/shared'
import { expect, mockFn, mockObject } from 'earl'
import { IndexerConfigurationRepository } from '../../../tools/uif/IndexerConfigurationRepository'
import { L2CostsRepository } from '../modules/l2-costs/repositories/L2CostsRepository'
import { LivenessRepository } from '../modules/liveness/repositories/LivenessRepository'
import { findUnusedConfigs } from './findUnusedConfigs'

describe(findUnusedConfigs.name, () => {
  const id1 = createTrackedTxId.random()
  const id2 = createTrackedTxId.random()
  const id3 = createTrackedTxId.random()
  const id4 = createTrackedTxId.random()

  it('should return an array of unused configs', async () => {
    const result = await findUnusedConfigs(
      mockIndexerConfigurationRepository([id1, id2, id3, id4]),
      mockL2CostsRepository([id1]),
      mockLivenessRepository([id2, id3]),
    )
    expect(result).toEqual([id4])
  })

  it('should return an empty array when no unused', async () => {
    const result = await findUnusedConfigs(
      mockIndexerConfigurationRepository([id1, id2, id3, id4]),
      mockL2CostsRepository([id1, id4]),
      mockLivenessRepository([id2, id3]),
    )
    expect(result).toEqual([])
  })
})

function mockIndexerConfigurationRepository(ids: string[]) {
  return mockObject<IndexerConfigurationRepository>({
    getSavedConfigurations: mockFn().resolvesTo(ids.map((id) => ({ id }))),
  })
}

function mockLivenessRepository(ids: string[]) {
  return mockObject<LivenessRepository>({
    getUsedConfigsIds: mockFn().resolvesTo(ids),
  })
}

function mockL2CostsRepository(ids: string[]) {
  return mockObject<L2CostsRepository>({
    getUsedConfigsIds: mockFn().resolvesTo(ids),
  })
}
