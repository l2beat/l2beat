import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { HttpClient2, RetryHandler, RpcClient2 } from '@l2beat/shared'
import { assert } from '@l2beat/shared-pure'
import { mockObject } from 'earl'
import { ActivityConfig } from '../config/Config'
import { Providers } from './Providers'

export function initProviders(
  config: ActivityConfig | false,
  logger: Logger,
  http: HttpClient2,
): Providers {
  const evmClients: RpcClient2[] = []

  //TODO
  assert(config)

  for (const c of config.projects) {
    switch (c.config.type) {
      case 'rpc': {
        const client = new RpcClient2({
          url: c.config.url,
          http,
          rateLimiter: new RateLimiter({
            callsPerMinute: c.config.callsPerMinute,
          }),
          retryHandler: RetryHandler.RELIABLE_API(logger),
          logger,
          chain: c.id,
        })

        evmClients.push(client)
        break
      }
    }
  }
  return mockObject<Providers>()
}
