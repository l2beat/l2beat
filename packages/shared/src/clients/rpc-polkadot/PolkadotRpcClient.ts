import type { Block, json } from '@l2beat/shared-pure'
import { generateId } from '../../tools/generateId'
import { ClientCore, type ClientCoreDependencies } from '../ClientCore'
import {
  bytesToHex,
  decodeCompact,
  decodeU32Le,
  encodeU32Le,
  hexToBytes,
  twox64Concat,
  twox128,
} from './substrate'
import {
  type PolkadotBlock,
  PolkadotErrorResponse,
  PolkadotGetBlockHashResponse,
  PolkadotGetBlockResponse,
  PolkadotGetKeysPagedResponse,
  PolkadotGetStorageResponse,
  PolkadotQueryStorageAtResponse,
} from './types'

interface Dependencies extends ClientCoreDependencies {
  url: string
  generateId?: () => string
}

const TIMESTAMP_SHIFT = 4300

// Storage key prefixes are twox128 hashes of pallet and item names.
const STAKING = twox128(new TextEncoder().encode('Staking'))
const CURRENT_ERA = twox128(new TextEncoder().encode('CurrentEra'))
const ERAS_STAKERS_OVERVIEW = twox128(
  new TextEncoder().encode('ErasStakersOverview'),
)

const KEYS_PAGE_SIZE = 1000

export class PolkadotRpcClient extends ClientCore {
  constructor(private readonly $: Dependencies) {
    super($)
  }

  async getLatestBlockNumber(): Promise<number> {
    const block = await this.getBlock()
    return Number(block.header.number)
  }

  async getBlockWithTransactions(
    blockNumber: number | 'latest',
  ): Promise<Block> {
    const height = blockNumber === 'latest' ? undefined : blockNumber
    const block = await this.getBlock(height)

    const bn = Number(block.header.number)

    return {
      number: bn,
      hash: 'UNSUPPORTED',
      logsBloom: 'UNSUPPORTED',
      timestamp: PolkadotRpcClient.calculateAvailTimestamp(bn),
      transactions: [], // UNSUPPORTED
    }
  }

  async getBlock(height?: number): Promise<PolkadotBlock> {
    const hashResponse = await this.query(
      'chain_getBlockHash',
      height ? [height] : [],
    )

    const hash = PolkadotGetBlockHashResponse.safeParse(hashResponse)

    if (!hash.success) {
      this.$.logger.warn('Invalid response', {
        height,
        response: JSON.stringify(hash),
      })
      throw new Error(`Block ${height ?? 'latest'}: Error during parsing`)
    }

    const blockResponse = await this.query('chain_getBlock', [hash.data.result])

    const block = PolkadotGetBlockResponse.safeParse(blockResponse)

    if (!block.success) {
      this.$.logger.warn('Invalid response', {
        height,
        response: JSON.stringify(blockResponse),
      })
      throw new Error(`Block ${height ?? 'latest'}: Error during parsing`)
    }

    return block.data.result.block
  }

  async query(
    method: string,
    params: (string | number | boolean | string[] | Record<string, string>)[],
  ) {
    return await this.fetch(this.$.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method,
        params,
        id: this.$.generateId ? this.$.generateId() : generateId(),
        jsonrpc: '2.0',
      }),
      redirect: 'follow',
      timeout: 5_000, // Most RPCs respond in ~2s during regular conditions
    })
  }

  override validateResponse(response: json): {
    success: boolean
    message?: string
  } {
    const parsedError = PolkadotErrorResponse.safeParse(response)

    if (parsedError.success) {
      this.$.logger.warn('Response validation error', {
        ...parsedError.data.error,
      })
      return { success: false }
    }

    return { success: true }
  }

  /**
   * Validator stake overview for the chain's current staking era, read
   * straight from Substrate storage over JSON-RPC (see substrate.ts for the
   * key hashing and SCALE decoding this requires).
   */
  async getStakingEraOverview(): Promise<Record<string, Exposure>> {
    const era = await this.getCurrentEra()

    // Staking.ErasStakersOverview is a (Twox64Concat era, Twox64Concat
    // account) double map, so all entries of one era share this prefix.
    const prefix = bytesToHex(
      concatBytes(
        STAKING,
        ERAS_STAKERS_OVERVIEW,
        twox64Concat(encodeU32Le(era)),
      ),
    )
    const keys = await this.getStorageKeys(prefix)

    const overview: Record<string, Exposure> = {}
    for (const [key, value] of await this.queryStorageAt(keys)) {
      if (value === null) continue
      // The key ends with twox64Concat(AccountId32): 8 hash bytes + the
      // 32-byte account id, reported as hex (the id is only used as a
      // unique label for counting).
      const validator = `0x${key.slice(-64)}`
      // Value is a SCALE PagedExposureMetadata:
      // compact total, compact own, u32 nominatorCount, u32 pageCount.
      const bytes = hexToBytes(value)
      const total = decodeCompact(bytes, 0)
      const own = decodeCompact(bytes, total.offset)
      overview[validator] = { own: own.value, total: total.value }
    }
    return overview
  }

  private async getCurrentEra(): Promise<number> {
    const key = bytesToHex(concatBytes(STAKING, CURRENT_ERA))
    const response = PolkadotGetStorageResponse.parse(
      await this.query('state_getStorage', [key]),
    )
    if (response.result === null) {
      throw new Error('Staking.CurrentEra is not set')
    }
    return decodeU32Le(hexToBytes(response.result), 0)
  }

  private async getStorageKeys(prefix: string): Promise<string[]> {
    const keys: string[] = []
    let startKey: string | undefined
    while (true) {
      const page = PolkadotGetKeysPagedResponse.parse(
        await this.query('state_getKeysPaged', [
          prefix,
          KEYS_PAGE_SIZE,
          ...(startKey ? [startKey] : []),
        ]),
      ).result
      keys.push(...page)
      if (page.length < KEYS_PAGE_SIZE) return keys
      startKey = page[page.length - 1]
    }
  }

  private async queryStorageAt(
    keys: string[],
  ): Promise<[string, string | null][]> {
    if (keys.length === 0) return []
    const response = PolkadotQueryStorageAtResponse.parse(
      await this.query('state_queryStorageAt', [keys]),
    )
    return response.result.flatMap((changeSet) => changeSet.changes)
  }

  get chain() {
    return this.$.sourceName
  }

  static calculateAvailTimestamp(blockNumber: number) {
    const referenceBlock = 1
    const referenceTimestamp = 1720082320

    // Define the block time interval in milliseconds (20 seconds)
    const blockInterval = 20 // 20 seconds

    // Calculate the difference in blocks
    const blockDifference = blockNumber - referenceBlock

    // Calculate the timestamp by adding the time difference to the reference timestamp
    const timestamp =
      referenceTimestamp + blockDifference * blockInterval + TIMESTAMP_SHIFT

    return timestamp
  }
}
function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const result = new Uint8Array(parts.reduce((sum, p) => sum + p.length, 0))
  let offset = 0
  for (const part of parts) {
    result.set(part, offset)
    offset += part.length
  }
  return result
}

type Exposure = {
  own: bigint
  total: bigint
}
