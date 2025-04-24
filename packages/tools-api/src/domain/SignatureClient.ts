import type { Logger } from '@l2beat/backend-tools'
import type { FourByteClient } from '../services/api/FourByteClient'
import type { OpenChainClient } from '../services/api/OpenChainClient'

export class SignatureClient {
  constructor(
    private openChainClient: OpenChainClient,
    private fourByteClient: FourByteClient,
    private logger: Logger,
  ) {
    this.logger = logger.for(this)
  }

  async lookup(selector: `0x${string}`): Promise<string[]> {
    const { results } = await promisesWithTimeout(
      [
        this.openChainClient.lookup(selector),
        this.fourByteClient.lookup(selector),
      ],
      1000,
      this.logger,
    )
    return results
      .flatMap((r) => r ?? [])
      .filter((v, i, a) => a.indexOf(v) === i)
  }
}

async function promisesWithTimeout<T>(
  promises: Promise<T>[],
  timeoutMs: number,
  logger: Logger,
) {
  const results: (T | undefined)[] = new Array(promises.length).fill(undefined)
  const completed: boolean[] = new Array(promises.length).fill(false)

  const racePromises = promises.map(async (promise, index) => {
    try {
      const result = await promise
      results[index] = result
      completed[index] = true
    } catch (error) {
      logger.error(error)
      completed[index] = true
    }
  })

  const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs))
  await Promise.race([Promise.all(racePromises), timeout])

  return { results, completed }
}
