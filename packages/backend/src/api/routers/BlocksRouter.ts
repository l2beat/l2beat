import Router from '@koa/router'
import { getHourlyTimestamps, UnixTime } from '@l2beat/shared-pure'

import { BlocksController } from '../controllers/BlocksController'
import {
  renderStatusXPage,
  UpdaterStatus,
} from '../controllers/status/view/StatusXPage'

const NOW = UnixTime.now()

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
          statuses: getHourlyTimestamps(NOW.add(-365, 'days'), NOW)
            .sort((a, b) => b.toNumber() - a.toNumber())
            .map((timestamp) => ({
              timestamp,
              status: getRandomStatus(),
            })),
        },
      ] as UpdaterStatus[],
    })
  })

  return router
}

function getRandomStatus(): 'synced' | 'notSynced' {
  return Math.random() > 0.5 ? 'synced' : 'notSynced'
}
