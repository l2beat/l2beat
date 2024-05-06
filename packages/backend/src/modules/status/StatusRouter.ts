import Router from '@koa/router'
import { z } from 'zod'

import { withTypedContext } from '../../api/types'
import { IndexerConfigurationRepository } from '../../tools/uif/IndexerConfigurationRepository'
import { IndexerStateRepository } from '../../tools/uif/IndexerStateRepository'
import { renderStatusPagesLinksPage } from './StatusPagesLinksPage'

export function createStatusRouter(
  indexerStateRepository: IndexerStateRepository,
  indexerConfigurations: IndexerConfigurationRepository,
) {
  const router = new Router()

  router.get(
    '/status/configurations',
    withTypedContext(
      z.object({
        query: z.object({
          indexer: z.string().optional(),
        }),
      }),
      async (ctx) => {
        const configurations = ctx.query.indexer
          ? await indexerConfigurations.getSavedConfigurations(
              ctx.query.indexer,
            )
          : await indexerConfigurations.getAll()

        ctx.body = {
          configurations: configurations.map((c) => ({
            ...c,
            properties: JSON.parse(c.properties) as unknown as Record<
              string,
              unknown
            >,
          })),
        }
      },
    ),
  )

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
