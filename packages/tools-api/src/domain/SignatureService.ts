import type { Logger } from '@l2beat/backend-tools'
import { toFunctionSelector } from 'viem'
import type { DiscoveredConfig } from '../config/types'
import type { FourByteClient } from '../services/api/FourByteClient'
import type { OpenChainClient } from '../services/api/OpenChainClient'

export interface ISignatureService {
  lookup(selector: `0x${string}`): Promise<string[]>
}

export class SignatureService implements ISignatureService {
  private known = new Map<`0x${string}`, string[]>()

  constructor(
    private openChainClient: OpenChainClient,
    private fourByteClient: FourByteClient,
    discovered: DiscoveredConfig,
    private logger: Logger,
  ) {
    this.logger = logger.for(this)

    for (const signature of discovered.allAbis) {
      if (!signature.startsWith('function ')) {
        continue
      }
      const selector = toFunctionSelector(signature)
      const array = this.known.get(selector) ?? []
      array.push(signature)
      this.known.set(selector, array)
    }
  }

  async lookup(selector: `0x${string}`): Promise<string[]> {
    const known = this.known.get(selector)
    if (known) {
      return known
    }

    const { results } = await promisesWithTimeout(
      [
        this.openChainClient.lookup(selector),
        this.fourByteClient.lookup(selector),
      ],
      1000,
      this.logger,
    )

    const filtered = results
      .flatMap((r) => r ?? [])
      .filter((v, i, a) => a.indexOf(v) === i)
      .filter((v) => toFunctionSelector(v) === selector)
    this.known.set(selector, filtered)
    return filtered
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
