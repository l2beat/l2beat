import Router from '@koa/router'
import { EthereumAddress } from '@protocol-beat/types'
import { z } from 'zod'

import { DiscoveryController } from '../controllers/DiscoveryController'
import { withTypedContext } from './types'

export function createDiscoveryRouter(controller: DiscoveryController) {
  const router = new Router()

  router.get(
    '/api/discover/:address',
    withTypedContext(
      z.object({
        params: z.object({
          address: z.string().transform((address) => {
            try {
              return EthereumAddress(address)
            } catch {
              return address
            }
          }),
        }),
        query: z.object({
          maxDepth: z.coerce.number().optional(),
        }),
      }),
      async (ctx) => {
        const { address } = ctx.params
        const { maxDepth } = ctx.query

        const response = await controller.discover(address, maxDepth)

        ctx.body = response
      },
    ),
  )

  return router
}
