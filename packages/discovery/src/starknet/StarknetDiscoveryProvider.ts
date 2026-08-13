import type { Logger } from '@l2beat/backend-tools'
import {
  type HttpClient,
  STARKNET_ERROR_CODES,
  StarknetClient,
  type StarknetContractClass,
  type StarknetEvent,
} from '@l2beat/shared'
import type { DiscoveryCache } from '../discovery/provider/DiscoveryCache'

// Starkscan caps starknet_getEvents at 10k blocks; other providers
// (e.g. Alchemy) allow much larger spans - configurable via options
const DEFAULT_EVENT_BLOCK_SPAN = 10_000
const VOYAGER_API_URL = 'https://api.voyager.online/beta'

export interface StarknetDiscoveryProviderOptions {
  rpcUrl: string
  /** Extra headers for the RPC, e.g. X-Starkscan-Api-Key */
  rpcHeaders?: Record<string, string>
  voyagerApiKey?: string
  callsPerMinute?: number
  /** Max block range per starknet_getEvents request (provider-dependent) */
  eventBlockSpan?: number
}

export interface VoyagerSource {
  compilerVersion?: string
  files: Record<string, string>
}

export interface VoyagerContractInfo {
  deploymentBlockNumber?: number
  deploymentTimestamp?: number
  contractAlias?: string
  classAlias?: string
}

export type StarknetCallOutcome =
  | { success: true; result: string[] }
  | { success: false; error: string }

export class StarknetDiscoveryProvider {
  private readonly client: StarknetClient

  constructor(
    private readonly http: HttpClient,
    private readonly cache: DiscoveryCache,
    private readonly logger: Logger,
    private readonly options: StarknetDiscoveryProviderOptions,
    readonly blockNumber: number,
  ) {
    this.client = new StarknetClient({
      http,
      logger,
      sourceName: 'starknet',
      callsPerMinute: options.callsPerMinute ?? 300,
      retryStrategy: 'SCRIPT',
      url: options.rpcUrl,
      headers: options.rpcHeaders,
      allowedErrorCodes: [
        STARKNET_ERROR_CODES.CONTRACT_NOT_FOUND,
        STARKNET_ERROR_CODES.ENTRYPOINT_NOT_FOUND,
        STARKNET_ERROR_CODES.CLASS_HASH_NOT_FOUND,
        STARKNET_ERROR_CODES.CONTRACT_ERROR,
      ],
    })
  }

  static async create(
    http: HttpClient,
    cache: DiscoveryCache,
    logger: Logger,
    options: StarknetDiscoveryProviderOptions,
  ): Promise<StarknetDiscoveryProvider> {
    const pinned = new StarknetDiscoveryProvider(
      http,
      cache,
      logger,
      options,
      0,
    )
    const blockNumber = await pinned.client.getLatestBlockNumber()
    return new StarknetDiscoveryProvider(
      http,
      cache,
      logger,
      options,
      blockNumber,
    )
  }

  async getClassHashAt(address: string): Promise<string | undefined> {
    return await this.cached(
      `starknet.getClassHashAt.${this.blockNumber}.${address}`,
      () => this.client.getClassHashAt(address, this.blockNumber),
    )
  }

  /** Classes are immutable, so the cache key ignores the block number */
  async getClass(
    classHash: string,
  ): Promise<StarknetContractClass | undefined> {
    return await this.cached(`starknet.getClass.${classHash}`, () =>
      this.client.getClass(classHash, this.blockNumber),
    )
  }

  async call(
    address: string,
    selector: string,
    calldata: string[] = [],
  ): Promise<StarknetCallOutcome> {
    const key = `starknet.call.${this.blockNumber}.${address}.${selector}.${calldata.join(',')}`
    const result = await this.cached(key, async () => {
      const outcome = await this.client.tryCall(
        {
          contract_address: address,
          entry_point_selector: selector,
          calldata,
        },
        this.blockNumber,
      )
      if (outcome.success) {
        return { success: true as const, result: outcome.result }
      }
      return {
        success: false as const,
        error: `${outcome.errorCode}: ${outcome.errorMessage}`,
      }
    })
    return result ?? { success: false, error: 'Empty cache entry' }
  }

  /**
   * All events emitted by the address from `fromBlock` up to the pinned block,
   * fetched in provider-limit-sized segments, each cached separately.
   */
  async getEvents(
    address: string,
    fromBlock: number,
    keyFilter?: string[],
  ): Promise<StarknetEvent[]> {
    const span = this.options.eventBlockSpan ?? DEFAULT_EVENT_BLOCK_SPAN
    const events: StarknetEvent[] = []
    for (let start = fromBlock; start <= this.blockNumber; start += span) {
      const end = Math.min(start + span - 1, this.blockNumber)
      const key = `starknet.getEvents.${address}.${start}.${end}.${keyFilter?.join(',') ?? ''}`
      const segment = await this.cached(key, () =>
        this.client.getEvents(start, end, address, keyFilter ?? []),
      )
      events.push(...(segment ?? []))
    }
    return events
  }

  async getVoyagerSource(
    classHash: string,
  ): Promise<VoyagerSource | undefined> {
    if (this.options.voyagerApiKey === undefined) {
      return undefined
    }
    return await this.cached(`starknet.voyagerSource.${classHash}`, () =>
      this.fetchVoyagerSource(classHash),
    )
  }

  async getVoyagerContractInfo(
    address: string,
  ): Promise<VoyagerContractInfo | undefined> {
    if (this.options.voyagerApiKey === undefined) {
      return undefined
    }
    return await this.cached(`starknet.voyagerContract.${address}`, () =>
      this.fetchVoyagerContractInfo(address),
    )
  }

  private async fetchVoyagerSource(
    classHash: string,
  ): Promise<VoyagerSource | undefined> {
    const response = await this.fetchVoyager(`/classes/${classHash}/source`)
    if (
      typeof response?.sourceCode !== 'object' ||
      response.sourceCode === null
    ) {
      return undefined
    }
    const files: Record<string, string> = {}
    for (const [path, content] of Object.entries(response.sourceCode)) {
      if (typeof content === 'string') {
        files[path] = content
      }
    }
    if (Object.keys(files).length === 0) {
      return undefined
    }
    return {
      compilerVersion:
        typeof response.compilerVersion === 'string'
          ? response.compilerVersion
          : undefined,
      files,
    }
  }

  private async fetchVoyagerContractInfo(
    address: string,
  ): Promise<VoyagerContractInfo | undefined> {
    const response = await this.fetchVoyager(`/contracts/${address}`)
    if (response === undefined) {
      return undefined
    }
    return {
      deploymentBlockNumber:
        typeof response.blockNumber === 'number'
          ? response.blockNumber
          : undefined,
      deploymentTimestamp:
        typeof response.creationTimestamp === 'number'
          ? response.creationTimestamp
          : undefined,
      contractAlias:
        typeof response.contractAlias === 'string'
          ? response.contractAlias
          : undefined,
      classAlias:
        typeof response.classAlias === 'string'
          ? response.classAlias
          : undefined,
    }
  }

  private async fetchVoyager(
    path: string,
    // biome-ignore lint/suspicious/noExplicitAny: dynamic JSON traversal
  ): Promise<Record<string, any> | undefined> {
    try {
      const response = await this.http.fetch(`${VOYAGER_API_URL}${path}`, {
        headers: {
          'x-api-key': this.options.voyagerApiKey ?? '',
          accept: 'application/json',
        },
        timeout: 30_000,
      })
      if (typeof response !== 'object' || response === null) {
        return undefined
      }
      return response as Record<string, unknown>
    } catch (error) {
      this.logger.warn(`Voyager request failed: ${path}`, { error })
      return undefined
    }
  }

  private async cached<T>(
    key: string,
    fetch: () => Promise<T>,
  ): Promise<T | undefined> {
    const hit = await this.cache.get(key)
    if (hit !== undefined) {
      const parsed = JSON.parse(hit) as { value?: T }
      return parsed.value
    }
    const value = await fetch()
    await this.cache.set(key, JSON.stringify({ value }))
    return value
  }
}
