import { Logger } from '@l2beat/backend-tools'
import type {
  BlobClient,
  BlobsInBlock,
  CelestiaApiClient,
  CoingeckoClient,
} from '@l2beat/shared'
import {
  assert,
  Bytes,
  EthereumAddress,
  Hash256,
  Retries,
  UnixTime,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import type { providers } from 'ethers'
import type {
  ContractSource,
  IEtherscanClient,
} from '../../utils/IEtherscanClient'
import {
  batchReadStorageViaOverride,
  type StorageSlot,
} from './batchStorageReader'
import { DebugTransactionCallResponse } from './DebugTransactionTrace'
import type { RawProviders } from './IProvider'
import { ProviderMeasurement, ProviderStats } from './Stats'

export interface RawContractDeployment {
  deployer: EthereumAddress
  transactionHash: Hash256
  blockNumber: number
  timestamp: UnixTime
}

const shouldRetry = Retries.exponentialBackOff({
  stepMs: 500, // 0.5, 1s, 2s, 4s, 8s, 16s, 32s, 64s, 128s, 256s
  maxAttempts: 10,
  maxDistanceMs: Number.POSITIVE_INFINITY,
  notifyAfterAttempts: Number.POSITIVE_INFINITY,
})

// What one ethbeat_heldTokens call accepts.
export const HELD_TOKENS_HOLDERS_MAX = 100
export const HELD_TOKENS_FILTER_MAX = 10_000

const HELD_TOKENS_INTERNAL_ERROR_CODE = -32603

export class LowLevelProvider {
  public stats: ProviderStats = new ProviderStats()

  constructor(
    private readonly provider: providers.JsonRpcProvider,
    private readonly eventProvider: providers.JsonRpcProvider,
    private readonly etherscanClient: IEtherscanClient,
    private readonly coingeckoClient: CoingeckoClient,
    private readonly celestiaApiClient?: CelestiaApiClient,
    private readonly blobClient?: BlobClient,
    private readonly logger: Logger = Logger.SILENT,
  ) {}

  getRawProviders(): RawProviders {
    return {
      baseProvider: this.provider,
      eventProvider: this.eventProvider,
      etherscanClient: this.etherscanClient,
      blobClient: this.blobClient,
      celestiaApiClient: this.celestiaApiClient,
      coingeckoClient: this.coingeckoClient,
    }
  }

  call(
    address: EthereumAddress,
    data: Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    return this.measure(() => {
      return rpcWithRetries(
        async () => {
          const result = await this.provider.call(
            { to: address.toString(), data: data.toString() },
            blockNumber,
          )
          return Bytes.fromHex(result)
        },
        this.logger,
        `call ${address.toString()} ${data.length} ${blockNumber}`,
      )
    }, ProviderMeasurement.CALL)
  }

  getStorage(
    address: EthereumAddress,
    slot: number | bigint | Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    return this.measure(() => {
      return rpcWithRetries(
        async () => {
          const result = await this.provider.getStorageAt(
            address.toString(),
            slot instanceof Bytes ? slot.toString() : slot,
            blockNumber,
          )
          return Bytes.fromHex(result)
        },
        this.logger,
        `getStorage ${address.toString()} ${slot} ${blockNumber}`,
      )
    }, ProviderMeasurement.GET_STORAGE)
  }

  batchReadStorage(
    address: EthereumAddress,
    slots: readonly StorageSlot[],
    blockNumber: number,
  ): Promise<Bytes[]> {
    return this.measure(() => {
      return rpcWithRetries(
        () =>
          batchReadStorageViaOverride(
            this.provider,
            address,
            slots,
            blockNumber,
          ),
        this.logger,
        `batchReadStorage ${address.toString()} ${slots.length} ${blockNumber}`,
      )
    }, ProviderMeasurement.GET_STORAGE)
  }

  getLogs(
    address: EthereumAddress,
    topics: (string | string[] | null)[],
    fromBlock: number,
    toBlock: number,
  ): Promise<providers.Log[]> {
    return this.measure(() => {
      return rpcWithRetries(
        async () => {
          return await this.eventProvider.getLogs({
            address: address.toString(),
            fromBlock,
            toBlock,
            topics,
          })
        },
        this.logger,
        `getLogs ${address.toString()} ${fromBlock} - ${toBlock}`,
      )
    }, ProviderMeasurement.GET_LOGS)
  }

  // Which of `tokens` each holder ever sent or received, in the order of
  // `holders`. The method exists only on our own RPC and only for chains whose
  // holder index is built, so everywhere else this throws.
  getHeldTokens(
    holders: EthereumAddress[],
    tokens: EthereumAddress[],
  ): Promise<EthereumAddress[][]> {
    assert(holders.length >= 1, 'No holders to ask about')
    assert(holders.length <= HELD_TOKENS_HOLDERS_MAX, 'Too many holders')
    assert(tokens.length >= 1, 'No tokens to filter by')
    assert(tokens.length <= HELD_TOKENS_FILTER_MAX, 'Too many tokens')

    return this.measure(async () => {
      const params = [
        holders.map((holder) => holder.toLowerCase()),
        { tokens: tokens.map((token) => token.toLowerCase()) },
      ]
      const response: unknown = await retryOnceOnInternalError(() =>
        this.provider.send('ethbeat_heldTokens', params),
      )
      return parseHeldTokens(response, holders)
    }, ProviderMeasurement.GET_HELD_TOKENS)
  }

  getTransaction(
    transactionHash: Hash256,
  ): Promise<providers.TransactionResponse | undefined> {
    return this.measure(() => {
      return rpcWithRetries(
        async () => {
          return (
            (await this.provider.getTransaction(transactionHash.toString())) ??
            undefined
          )
        },
        this.logger,
        `getTransaction ${transactionHash.toString()}`,
      )
    }, ProviderMeasurement.GET_TRANSACTION)
  }

  getDebugTrace(
    transactionHash: Hash256,
  ): Promise<DebugTransactionCallResponse> {
    return this.measure(() => {
      return rpcWithRetries(
        async () => {
          const response = await this.provider.send('debug_traceTransaction', [
            transactionHash.toString(),
            { tracer: 'callTracer', tracerConfig: { withLog: true } },
          ])
          return DebugTransactionCallResponse.parse(response)
        },
        this.logger,
        `debug_traceTransaction ${transactionHash.toString()}`,
      )
    }, ProviderMeasurement.GET_DEBUG_TRACE)
  }

  getBytecode(address: EthereumAddress, blockNumber: number): Promise<Bytes> {
    return this.measure(() => {
      return rpcWithRetries(
        async () => {
          const result = await this.provider.getCode(
            address.toString(),
            blockNumber,
          )
          return Bytes.fromHex(result)
        },
        this.logger,
        `getCode ${address.toString()} ${blockNumber}`,
      )
    }, ProviderMeasurement.GET_BYTECODE)
  }

  getSource(address: EthereumAddress): Promise<ContractSource> {
    return this.measure(() => {
      return this.etherscanClient.getContractSource(address)
    }, ProviderMeasurement.GET_SOURCE)
  }

  getDeployment(
    address: EthereumAddress,
  ): Promise<RawContractDeployment | undefined> {
    return this.measure(async () => {
      const transactionHash =
        await this.etherscanClient.getContractDeploymentTx(address)
      if (transactionHash === undefined) {
        // getContractDeploymentTx API is not available
        return undefined
      }

      // Hack for Base and possibly others
      if (transactionHash === Hash256.ZERO) {
        return {
          transactionHash,
          deployer: EthereumAddress.ZERO,
          blockNumber: 0,
          timestamp: UnixTime((await this.getBlock(1)).timestamp),
        }
      }

      const tx = await this.getTransaction(transactionHash)
      if (tx === undefined) {
        return undefined
      }

      assert(tx.blockNumber, 'Transaction returned without a block number.')
      const deployer = EthereumAddress(tx.from)
      const blockNumber = tx.blockNumber
      const block = await this.getBlock(blockNumber)
      const timestamp = UnixTime(block.timestamp)

      return {
        transactionHash,
        deployer,
        blockNumber,
        timestamp,
      }
    }, ProviderMeasurement.GET_DEPLOYMENT)
  }

  getBlock(blockNumber: number): Promise<providers.Block> {
    return this.measure(() => {
      return rpcWithRetries(
        async () => {
          return await this.provider.getBlock(blockNumber)
        },
        this.logger,
        `getBlock ${blockNumber}`,
      )
    }, ProviderMeasurement.GET_BLOCK)
  }

  getBlockNumber(): Promise<number> {
    return this.measure(() => {
      return rpcWithRetries(
        async () => {
          return await this.provider.getBlockNumber()
        },
        this.logger,
        'getBlockNumber',
      )
    }, ProviderMeasurement.GET_BLOCKNUMBER)
  }

  getBlockNumberAtOrBeforeExplorer(timestamp: UnixTime): Promise<number> {
    return this.measure(() => {
      return rpcWithRetries(
        async () => {
          return await this.etherscanClient.getBlockNumberAtOrBefore(timestamp)
        },
        this.logger,
        'getBlockNumberAtOrBefore',
      )
    }, ProviderMeasurement.GET_BLOCK_NUMBER_AT_OR_BEFORE)
  }

  async getBlobs(txHash: string): Promise<BlobsInBlock> {
    assert(
      this.blobClient,
      'BlobClient is not available, configure the .env to include beacon url.',
    )
    return await this.blobClient.getRelevantBlobs(txHash)
  }

  async celestiaBlobExists(
    height: number,
    namespace: string,
    commitment: string,
  ) {
    assert(
      this.celestiaApiClient,
      'CelestiaApiClient is not available, configure the .env to include celestia API url.',
    )
    return await this.celestiaApiClient.blobExists(
      height,
      namespace,
      commitment,
    )
  }

  async getCelestiaBlockResultEvents(height: number) {
    assert(
      this.celestiaApiClient,
      'CelestiaApiClient is not available, configure the .env to include celestia API url.',
    )
    return await this.celestiaApiClient.getBlockResultEvents(height)
  }

  private async measure<T>(fn: () => Promise<T>, key: number): Promise<T> {
    const start = performance.now()
    try {
      return await fn()
    } finally {
      const duration = performance.now() - start
      this.stats.mark(key, duration)
    }
  }
}

// rpcWithRetries would not do: it backs off for minutes on any JSON-RPC
// error, including the one that says the method does not exist. The index
// asks for exactly one retry, of the lookup that ran out of time: the first
// attempt has read the rows into memory.
async function retryOnceOnInternalError<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch (e) {
    const code = (e as { error?: { code?: unknown } } | null)?.error?.code
    if (code !== HELD_TOKENS_INTERNAL_ERROR_CODE) {
      throw e
    }
  }
  return await fn()
}

const HeldTokensResponse = v.object({
  holders: v.array(
    v.object({
      holder: v.string(),
      tokens: v.array(v.object({ address: v.string() })),
    }),
  ),
})

export function parseHeldTokens(
  response: unknown,
  holders: EthereumAddress[],
): EthereumAddress[][] {
  const answers = HeldTokensResponse.parse(response).holders
  assert(answers.length === holders.length, 'Answer for another holder count')

  return answers.map((answer, index) => {
    assert(
      answer.holder === holders[index]?.toLowerCase(),
      'Answer for another holder',
    )
    return answer.tokens.map((token) => EthereumAddress(token.address))
  })
}

export async function rpcWithRetries<T>(
  fn: () => Promise<T>,
  logger: Logger,
  description: string,
): Promise<T> {
  let attempts = 0
  while (true) {
    try {
      return await fn()
    } catch (e) {
      attempts++
      if (!isServerError(e)) {
        throw e
      }
      const result = shouldRetry(attempts, e)
      if (result.shouldStop) {
        throw e
      }
      logger.warn('Retrying RPC call', description, e)
      await new Promise((resolve) => setTimeout(resolve, result.executeAfter))
    }
  }
}

function isServerError(e: unknown): boolean {
  const parsed = topLevelEthersError.safeParse(e)
  if (parsed.success) {
    const topError = parsed.data
    let isServerError = false
    if (topError.error !== undefined && 'code' in topError.error) {
      isServerError ||= topError.error.status >= 400
      isServerError ||= topError.error.code === 'TIMEOUT'
      isServerError ||=
        topError.error.code === 'SERVER_ERROR' &&
        !(topError.error?.error?.message ?? '').includes('out of gas') &&
        topError.error?.error?.message !== 'execution reverted' &&
        topError.error?.error?.message !== 'gas uint64 overflow' &&
        topError.error?.error?.message !== 'invalid opcode: INVALID'
    } else {
      isServerError ||= topError.status >= 400
      isServerError ||=
        topError.code === 'SERVER_ERROR' &&
        !topError.message?.includes('Log response size exceeded')
      isServerError ||= topError.code === 'TIMEOUT'
    }

    return isServerError
  }

  return false
}

const ethersRPCError = v.object({
  message: v.string().optional(),
})

const ethersLoggerError = v.object({
  code: v.string(),
  status: v.number().default(200),
  error: ethersRPCError.optional(),
  message: v.string().optional(),
})

const topLevelEthersError = v.object({
  code: v.string(),
  status: v.number().default(200),
  error: v.union([ethersLoggerError, ethersRPCError]).optional(),
  message: v.string().optional(),
})
