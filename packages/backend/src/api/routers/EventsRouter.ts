import Router from '@koa/router'

import { ProjectInfo } from '../../model'
import { EthereumClient } from '../../peripherals/ethereum/EthereumClient'

export function createEventsRouter(
  ethereum: EthereumClient,
  projects: ProjectInfo[],
) {
  const router = new Router()

  router.get('/api/events', async (ctx) => {
    const events = projects
      .filter((p) => p.events)
      .map((p) => p.events)
      .flat()

    const result = []

    await Promise.allSettled(
      events.map(async (event) => {
        const res = await ethereum.getLogs(
          event.emitter,
          [event.abi.getEventTopic('SequencerBatchDeliveredFromOrigin')],
          15265446,
          15275446,
        )

        console.log(res.map((r) => r.blockNumber))
        result.push(res.map((r) => r.blockNumber))
      }),
    )

    ctx.body = JSON.stringify(result)
  })

  return router
}
