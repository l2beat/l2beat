import { InMemoryCache } from '@l2beat/shared-pure'
import { env } from '~/env'
import { getLogger } from '~/server/utils/logger'

export function isFrontendCacheEnabled(): boolean {
  return (
    !env.DISABLE_CACHE &&
    (env.DEPLOYMENT_ENV === 'production' || env.DEPLOYMENT_ENV === 'staging')
  )
}

export class FrontendInMemoryCache extends InMemoryCache {
  constructor(source: string) {
    super({
      logger: getLogger().for('InMemoryCache').tag({ source }),
      enabled: isFrontendCacheEnabled(),
    })
  }
}
