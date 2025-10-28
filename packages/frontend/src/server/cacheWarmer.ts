import type { Logger } from '@l2beat/backend-tools'
import cron from 'node-cron'
import { hotCacheFns } from 'scripts/hot-cache/hotCacheFns'

export function createCacheWarmer(logger: Logger) {
  logger = logger.for('CacheWarmer')

  cron.schedule('0,15,30,45 * * * *', async () => {
    await Promise.all(
      Object.entries(hotCacheFns).map(async ([key, fn]) => {
        const start = performance.now()
        const result = await fn()
        const duration = performance.now() - start
        logger.info('Cache warmed up', {
          key,
          durationMs: Math.round(duration),
        })
        return result
      }),
    )
  })

  logger.info('Started')
}
