import { IndexerConfigurationRepository } from '../../../tools/uif/IndexerConfigurationRepository'
import { L2CostsRepository } from '../modules/l2-costs/repositories/L2CostsRepository'
import { LivenessRepository } from '../modules/liveness/repositories/LivenessRepository'

export async function findUnusedConfigs(
  indexerConfigurationRepository: IndexerConfigurationRepository,
  l2CostsRepository: L2CostsRepository,
  livenessRepository: LivenessRepository,
): Promise<string[]> {
  const allConfigs =
    await indexerConfigurationRepository.getSavedConfigurations(
      'tracked_txs_indexer',
    )
  const l2CostsConfigs = await l2CostsRepository.getUsedConfigsIds()
  const livenessConfigs = await livenessRepository.getUsedConfigsIds()

  const usedConfigs = new Set([...l2CostsConfigs, ...livenessConfigs])

  return allConfigs.filter((c) => !usedConfigs.has(c.id)).map((c) => c.id)
}
