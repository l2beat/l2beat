import { env } from '~/env'
import { createCacheWarmer } from './server/cacheWarmer'
import { createDevServer, createServer } from './server/server'
import { getLogger } from './server/utils/logger'

interface StartServerOptions {
  mode: 'production' | 'development'
}

export async function startServer({ mode }: StartServerOptions) {
  const logger = getLogger()

  logger.info('Starting frontend...')

  if (mode === 'development') {
    await createDevServer(logger)
    return
  }

  await createServer(logger)

  if (env.REDIS_URL && env.DEPLOYMENT_ENV === 'production') {
    createCacheWarmer(logger)
  }
}
