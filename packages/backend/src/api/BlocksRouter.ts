import Router from '@koa/router'

import { BlocksView } from '../core/views/BlocksView'

export function createBlocksRouter(blocksView: BlocksView) {
  const router = new Router()

  router.get('/api/blocks', async (ctx) => {
    ctx.body = await blocksView.getAllBlocks()
  })

  return router
}
