import type { Logger } from '@l2beat/backend-tools'
import { toFunctionSelector } from 'viem'
import type { DiscoveredConfig } from '../../../config/types'
import type { FourByteClient } from '../../../third-party/FourByteClient'
import type { OpenChainClient } from '../../../third-party/OpenChainClient'

export interface ISignatureService {
  lookup(selector: `0x${string}`): Promise<string[]>
  lookupWellKnown(selector: `0x${string}`): string | undefined
  getInterface(selector: `0x${string}`): string | undefined
}

export class SignatureService implements ISignatureService {
  private known = new Map<`0x${string}`, string[]>()
  private wellKnown = new Map<
    `0x${string}`,
    { signature: string; interface: string }
  >()

  constructor(
    private openChainClient: OpenChainClient,
    private fourByteClient: FourByteClient,
    discovered: DiscoveredConfig,
    wellKnownAbi: Record<string, string[]>,
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

    for (const [_interface, signatures] of Object.entries(wellKnownAbi)) {
      for (const signature of signatures) {
        this.wellKnown.set(toFunctionSelector(signature), {
          signature,
          interface: _interface,
        })
      }
    }
  }

  async lookup(selector: `0x${string}`): Promise<string[]> {
    let zeroCount = 0
    for (const c of selector) {
      if (c === '0') zeroCount++
    }
    if (zeroCount > 7) {
      // This doesn't look like a selector
      return []
    }

    const wellKnown = this.wellKnown.get(selector)
    if (wellKnown) {
      return [wellKnown.signature]
    }

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

  lookupWellKnown(selector: `0x${string}`): string | undefined {
    return this.wellKnown.get(selector)?.signature
  }

  getInterface(selector: `0x${string}`): string | undefined {
    return this.wellKnown.get(selector)?.interface
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
