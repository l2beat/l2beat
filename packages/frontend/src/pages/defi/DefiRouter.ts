import type { InMemoryCache } from '@l2beat/shared-pure'
import express from 'express'
import { env } from '~/env'
import type { RenderFunction } from '~/ssr/types'
import type { Manifest } from '~/utils/Manifest'
import { getLiquidStakingData } from './liquid-staking/getLiquidStakingData'

export function createDefiRouter(
  manifest: Manifest,
  render: RenderFunction,
  cache: InMemoryCache,
) {
  // Ossification links to the project pages of the DeFi projects it tracks.
  if (!env.CLIENT_SIDE_DEFI_ENABLED && !env.CLIENT_SIDE_OSSIFICATION_ENABLED) {
    return null
  }

  const router = express.Router()

  if (env.CLIENT_SIDE_DEFI_ENABLED) {
    // Liquid staking is the only DeFi category with a page so far.
    router.get('/defi', (_req, res) => {
      res.redirect(301, '/defi/liquid-staking')
    })

    router.get('/defi/liquid-staking', async (req, res) => {
      const data = await cache.get(
        {
          key: ['defi', 'liquid-staking', req.originalUrl],
          ttl: 5 * 60,
          staleWhileRevalidate: 25 * 60,
        },
        () => getLiquidStakingData(manifest, req.originalUrl, cache),
      )
      const html = await render(data, req.originalUrl)
      res.status(200).send(html)
    })
  }

  return router
}
