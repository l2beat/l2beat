import Router from '@koa/router'

import { BlocksController } from '../controllers/BlocksController'

export function createBlocksRouter(blocksController: BlocksController) {
  const router = new Router()

  router.get('/api/blocks', async (ctx) => {
    ctx.body = await blocksController.getAllBlocks()
  })

  return router
}
