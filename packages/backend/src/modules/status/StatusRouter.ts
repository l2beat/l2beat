import Router from '@koa/router'
import { EscrowEntry } from '@l2beat/shared-pure'
import { groupBy } from 'lodash'
import { z } from 'zod'

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
        if (!config.tvl) {
          ctx.body = 'TVL is disabled'
          return
        }

        const projectsFilter = ctx.query.projects?.split(',')

        const escrows = config.tvl.amounts
          .filter((a): a is EscrowEntry => a.type === 'escrow')
          .filter(
            (a) =>
              !projectsFilter || projectsFilter.includes(a.project.toString()),
          )

        const byProject = groupBy(escrows, (a) => a.project.toString())

        const byProjectByEscrow: Record<
          string,
          Record<string, { chain: string; tokens: string[] }>
        > = {}

        for (const p of Object.keys(byProject)) {
          const byEscrow = groupBy(byProject[p], (a) =>
            a.escrowAddress.toString(),
          )

          byProjectByEscrow[p] = Object.fromEntries(
            Object.entries(byEscrow).map(([k, v]) => [
              k,
              {
                chain: v[0].chain,
                tokens: v.map(escrowToDisplay),
              },
            ]),
          )
        }

        ctx.body = byProjectByEscrow
      },
    ),
  )

  router.get('/status', (ctx) => {
    ctx.body = renderStatusPagesLinksPage()
  })

  return router
}

function escrowToDisplay(escrow: EscrowEntry) {
  return `${escrow.symbol} - ${escrow.address.toString()}`
}
