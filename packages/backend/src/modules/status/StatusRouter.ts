import Router from '@koa/router'

import { IndexerConfigurationRepository } from '../../tools/uif/IndexerConfigurationRepository'
import { IndexerStateRepository } from '../../tools/uif/IndexerStateRepository'
import { renderStatusPagesLinksPage } from './StatusPagesLinksPage'

export function createStatusRouter(
  indexerStateRepository: IndexerStateRepository,
  indexerConfigurations: IndexerConfigurationRepository,
) {
  const router = new Router()

  router.get('/status/configurations', async (ctx) => {
    const configurations = await indexerConfigurations.getAll()

    ctx.body = {
      configurations,
    }
  })

  router.get('/status/indexers', async (ctx) => {
    const indexers = await indexerStateRepository.getAll()

    ctx.body = {
      ...Object.fromEntries(
        indexers
          .sort((a, b) => a.indexerId.localeCompare(b.indexerId))
          .map((i) => [i.indexerId, i.safeHeight]),
      ),
    }
  })

  router.get('/status', (ctx) => {
    ctx.body = renderStatusPagesLinksPage()
  })

  return router
}
