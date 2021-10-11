import Router from '@koa/router'

import { BlockNumberRepository } from '../peripherals/database/BlockNumberRepository'

export function createBlockNumberRouter(
  blockNumberRepository: BlockNumberRepository
) {
  const router = new Router()

  router.get('/api/blocks', async (ctx) => {
    const all = await blockNumberRepository.getAll()
    ctx.body = all.map((x) => ({
      blockNumber: x.blockNumber.toString(),
      timestamp: x.timestamp.toDate().toISOString(),
    }))
  })

  return router
}
