import Router from '@koa/router'
import { EscrowEntry } from '@l2beat/shared-pure'
import { chain, groupBy } from 'lodash'
import { string, z } from 'zod'

import { withTypedContext } from '../../api/types'
import { Config } from '../../config'
import { IndexerConfigurationRepository } from '../../tools/uif/IndexerConfigurationRepository'
import { IndexerStateRepository } from '../../tools/uif/IndexerStateRepository'
import { renderStatusPagesLinksPage } from './StatusPagesLinksPage'

export function createStatusRouter(
  config: Config,
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

  router.get(
    '/status/escrows',
    withTypedContext(
      z.object({
        query: z.object({
          projects: z.string().optional(),
        }),
      }),
      (ctx) => {
        if (!config.tvl2) {
          ctx.body = 'TVL2 is disabled'
          return
        }

        const projectsFilter = ctx.query.projects?.split(',')

        const escrows = config.tvl2.amounts
          .filter((a): a is EscrowEntry => a.type === 'escrow')
          .filter(
            (a) =>
              !projectsFilter || projectsFilter.includes(a.project.toString()),
          )

        const byProject = groupBy(escrows, (a) => a.project.toString())

        const byEscrow = {}

        for (const p of Object.keys(byProject)) {
          const grouped = groupBy(byProject[p], (a) =>
            a.escrowAddress.toString(),
          )
          byEscrow[p] = Object.fromEntries(
            Object.entries(grouped).map(([k, v]) => [
              k,
              {
                chain: v[0].chain,
                tokens: v.map(escrowToDisplay),
              },
            ]),
          )
        }

        ctx.body = byEscrow
      },
    ),
  )

  router.get('/status', (ctx) => {
    ctx.body = renderStatusPagesLinksPage()
  })

  return router
}

function escrowToDisplay(escrow: EscrowEntry) {
  return escrow.address.toString()
}
