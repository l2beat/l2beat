import type { Logger } from '@l2beat/backend-tools'
import { refreshPrivacySnapshot } from './refreshPrivacySnapshot'

const REFRESH_INTERVAL_MS = 15 * 60 * 1000

export function startPrivacyRefreshLoop(baseLogger: Logger): void {
  const logger = baseLogger.for('PrivacyRefresh')

  const run = async () => {
    const startedAt = Date.now()
    try {
      const { written, skipped } = await refreshPrivacySnapshot(logger)
      logger.info('Refresh complete', {
        durationMs: Date.now() - startedAt,
        written,
        skippedCount: skipped.length,
      })
      for (const entry of skipped) {
        logger.warn('Bucket skipped, keeping last value', entry)
      }
    } catch (error) {
      logger.error('Refresh failed', {
        durationMs: Date.now() - startedAt,
        error,
      })
    }
  }

  void run()
  setInterval(() => void run(), REFRESH_INTERVAL_MS)
}
