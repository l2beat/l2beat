import { createBullBoard } from '@bull-board/api'
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter.js'
import { ExpressAdapter } from '@bull-board/express'
import { Logger } from '@l2beat/backend-tools'
import { Queue } from 'bullmq'
import express from 'express'

export async function startQueueDashboard({
  port,
  queues,
  logger,
  signalQueue,
}: { port: number; logger: Logger; queues: Queue[]; signalQueue: Queue }) {
  const serverAdapter = new ExpressAdapter()
  serverAdapter.setBasePath('/admin/queues')

  logger.info('Starting', { queueCount: queues.length })

  createBullBoard({
    queues: queues.map((q) => new BullMQAdapter(q)),
    serverAdapter: serverAdapter,
  })

  const app = express()

  app.use('/admin/queues', serverAdapter.getRouter())

  app.get('/refresh', (_req, res) => {
    signalQueue.add('RefreshSignal', {})
    res.status(201).send({ msg: 'Refresh signal sent' })
  })

  app.listen(port, () => {
    logger.info('Started', {
      port,
      url: `http://localhost:${port}/admin/queues`,
    })
  })
}
