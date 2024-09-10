import { Logger } from '@l2beat/backend-tools'
import { Worker } from 'bullmq'

export function setupWorkerLogging({
  worker,
  logger,
}: { worker: Worker; logger: Logger }) {
  worker.on('active', (job) => {
    logger.debug('Event processing job', { id: job.id, event: job.name })
  })

  worker.on('completed', (job) => {
    logger.debug('Event processing done', { id: job.id, eve: job.name })
  })

  worker.on('error', (error) => {
    logger.error('Worker error', { error })
  })

  worker.on('failed', (job, error) => {
    const hasStalled = !job

    if (hasStalled) {
      logger.error('Event processing stalled')
    } else {
      logger.error('Event processing failed', {
        id: job.id,
        name: job.name,
        error,
      })
    }
  })
}
