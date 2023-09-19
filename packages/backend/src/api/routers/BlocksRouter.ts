import Router from '@koa/router'
import { UnixTime } from '@l2beat/shared-pure'

import { BlocksController } from '../controllers/BlocksController'
import {
  renderStatusXPage,
  StatusPoint,
  UpdaterStatus,
} from '../controllers/status/view/StatusXPage'

export function createBlocksRouter(blocksController: BlocksController) {
  const router = new Router()

  router.get('/api/blocks', async (ctx) => {
    ctx.body = await blocksController.getAllBlocks()
  })

  router.get('/status-x', async (ctx) => {
    ctx.body = renderStatusXPage({
      statuses: [
        {
          updaterName: 'Aggregate',
          statuses: [
            ...(Array(1500).fill({
              timestamp: new UnixTime(0),
              status: 'synced',
            }) as StatusPoint[]),
          ],
        },
      ] as UpdaterStatus[],
    })
  })

  return router
}
