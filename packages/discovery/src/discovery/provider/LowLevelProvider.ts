import { BlobClient, BlobsInBlock } from '@l2beat/shared'
import {
  assert,
  Bytes,
  EthereumAddress,
  Hash256,
  Retries,
  UnixTime,
} from '@l2beat/shared-pure'
import { providers } from 'ethers'
import { z } from 'zod'
import { IEtherscanClient } from '../../utils/IEtherscanClient'
import { ContractSource } from '../../utils/IEtherscanClient'
import { DebugTransactionCallResponse } from './DebugTransactionTrace'
import { ContractDeployment, RawProviders } from './IProvider'
import { ProviderMeasurement, ProviderStats } from './Stats'

const shouldRetry = Retries.exponentialBackOff({
  stepMs: 500, // 0.5, 1s, 2s, 4s, 8s, 16s, 32s, 64s, 128s, 256s
  maxAttempts: 10,
  maxDistanceMs: Infinity,
  notifyAfterAttempts: Infinity,
})

export class LowLevelProvider {
  public stats: ProviderStats = new ProviderStats()

  constructor(
    private readonly provider: providers.JsonRpcProvider,
    private readonly eventProvider: providers.JsonRpcProvider,
    private readonly etherscanClient: IEtherscanClient,
    private readonly blobClient?: BlobClient,
  ) {}

  getRawProviders(): RawProviders {
    return {
      baseProvider: this.provider,
      eventProvider: this.eventProvider,
      etherscanClient: this.etherscanClient,
      blobClient: this.blobClient,
    }
  }

  async call(
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

        () => `call ${address.toString()} ${data.length} ${blockNumber}`,
      )
    }, ProviderMeasurement.CALL)
  }

  async getStorage(
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
        () => `getStorage ${address.toString()} ${slot} ${blockNumber}`,
      )
    }, ProviderMeasurement.GET_STORAGE)
  }

  async getLogs(
    address: EthereumAddress,
    topics: (string | string[] | null)[],
    fromBlock: number,
    toBlock: number,
  ) {
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
        () => `getLogs ${address.toString()} ${fromBlock} - ${toBlock}`,
      )
    }, ProviderMeasurement.GET_LOGS)
  }

  async getTransaction(
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
        () => `getTransaction ${transactionHash.toString()}`,
      )
    }, ProviderMeasurement.GET_TRANSACTION)
  }

  async getDebugTrace(
    transactionHash: Hash256,
  ): Promise<DebugTransactionCallResponse> {
    return this.measure(() => {
      return rpcWithRetries(
        async () => {
          const response = await this.provider.send('debug_traceTransaction', [
            transactionHash.toString(),
            { tracer: 'callTracer' },
          ])
          return DebugTransactionCallResponse.parse(response)
        },
        () => `debug_traceTransaction ${transactionHash.toString()}`,
      )
    }, ProviderMeasurement.GET_DEBUG_TRACE)
  }

  async getBytecode(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<Bytes> {
    return this.measure(() => {
      return rpcWithRetries(
        async () => {
          const result = await this.provider.getCode(
            address.toString(),
            blockNumber,
          )
          return Bytes.fromHex(result)
        },
        () => `getCode ${address.toString()} ${blockNumber}`,
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
  ): Promise<ContractDeployment | undefined> {
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
          timestamp: new UnixTime((await this.getBlock(1)).timestamp),
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
      const timestamp = new UnixTime(block.timestamp)

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
        () => `getBlock ${blockNumber}`,
      )
    }, ProviderMeasurement.GET_BLOCK)
  }

  getBlockNumber(): Promise<number> {
    return this.measure(() => {
      return rpcWithRetries(
        async () => {
          return await this.provider.getBlockNumber()
        },
        () => `getBlockNumber`,
      )
    }, ProviderMeasurement.GET_BLOCKNUMBER)
  }

  async getBlobs(txHash: string): Promise<BlobsInBlock> {
    assert(
      this.blobClient,
      'BlobClient is not available, configure the .env to include beacon url.',
    )
    return await this.blobClient.getRelevantBlobs(txHash)
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

export async function rpcWithRetries<T>(
  fn: () => Promise<T>,
  description: () => string,
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
      // TODO: (sz-piotr) Why console and not logger :(
      console.error('awaiting', description())
      console.error(e)
      await new Promise((resolve) => setTimeout(resolve, result.executeAfter))
    }
  }
}

function isServerError(e: unknown): boolean {
  const parsed = ethersError.safeParse(e)
  return (
    parsed.success &&
    ((parsed.data.error.status ?? 200) >= 400 ||
      (parsed.data.error.code === 'SERVER_ERROR' &&
        parsed.data.error.error.message !== 'out of gas' &&
        parsed.data.error.error.message !== 'execution reverted' &&
        parsed.data.error.error.message !== 'gas uint64 overflow' &&
        parsed.data.error.error.message !== 'invalid opcode: INVALID'))
  )
}

const ethersError = z.object({
  error: z.object({
    code: z.string(),
    status: z.number().optional(),
    error: z.object({
      code: z.number(),
      message: z.string(),
    }),
  }),
})
