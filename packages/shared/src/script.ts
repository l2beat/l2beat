import { Logger, RateLimiter } from '@l2beat/backend-tools'
import { HttpClient2, RpcClient2 } from './clients'
import { RetryHandler } from './tools'

async function main() {
  const c = new RpcClient2({
    url: 'https://1rpc.io/mode',
    http: new HttpClient2(),
    rateLimiter: new RateLimiter({ callsPerMinute: 60 }),
    retryHandler: RetryHandler.RELIABLE_API(Logger.SILENT),
    logger: Logger.SILENT,
    chain: 'chain',
  })

  await c.getBlockWithTransactions('latest')
  // add logic here
}

main().catch((e: unknown) => {
  console.error(e)
})
