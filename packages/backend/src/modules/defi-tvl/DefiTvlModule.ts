import { HttpClient } from '@l2beat/shared'
import { HourlyIndexer } from '../../tools/HourlyIndexer'
import { IndexerService } from '../../tools/uif/IndexerService'
import type { ApplicationModule, ModuleDependencies } from '../types'
import { DefiLlamaClient } from './DefiLlamaClient'
import { DefiTvlIndexer } from './DefiTvlIndexer'

export function createDefiTvlModule({
  config,
  logger,
  clock,
  db,
}: ModuleDependencies): ApplicationModule | undefined {
  if (!config.defiTvl) {
    logger.info('DefiTvlModule disabled')
    return
  }

  logger = logger.tag({ feature: 'defi-tvl', module: 'defi-tvl' })
  const hourlyIndexer = new HourlyIndexer(logger, clock)
  const indexerService = new IndexerService(db)
  const client = new DefiLlamaClient(new HttpClient(), config.defiTvl.apiUrl)
  const indexers = config.defiTvl.projects.map(
    (project) =>
      new DefiTvlIndexer(
        {
          parents: [hourlyIndexer],
          indexerService,
          configurations: [
            {
              id: project.configurationId,
              minHeight: project.sinceTimestamp,
              maxHeight: null,
              properties: project,
            },
          ],
          tags: { tag: project.projectId },
          db,
          client,
        },
        logger,
      ),
  )

  logger.info('DeFi TVL config loaded', {
    projects: config.defiTvl.projects.length,
    chains: config.defiTvl.projects.reduce(
      (sum, project) => sum + project.chains.length,
      0,
    ),
  })

  return {
    start: async () => {
      await hourlyIndexer.start()
      for (const indexer of indexers) {
        await indexer.start()
      }
    },
  }
}
