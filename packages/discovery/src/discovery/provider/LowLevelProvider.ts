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
import { ProviderStats, getZeroStats } from './Stats'

const shouldRetry = Retries.exponentialBackOff({
  stepMs: 500, // 0.5, 1s, 2s, 4s, 8s, 16s, 32s, 64s, 128s, 256s
  maxAttempts: 10,
  maxDistanceMs: Infinity,
  notifyAfterAttempts: Infinity,
})

export class LowLevelProvider {
  public stats: ProviderStats = getZeroStats()

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
    this.stats.callCount++
    return await rpcWithRetries(
      async () => {
        const result = await this.provider.call(
          { to: address.toString(), data: data.toString() },
          blockNumber,
        )
        return Bytes.fromHex(result)
      },

      () => `call ${address.toString()} ${data.length} ${blockNumber}`,
    )
  }

  async getStorage(
    address: EthereumAddress,
    slot: number | bigint | Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    this.stats.getStorageCount++
    return await rpcWithRetries(
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
  }

  async getLogs(
    address: EthereumAddress,
    topics: (string | string[] | null)[],
    fromBlock: number,
    toBlock: number,
  ) {
    this.stats.getLogsCount++
    return await rpcWithRetries(
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
  }

  async getTransaction(
    transactionHash: Hash256,
  ): Promise<providers.TransactionResponse | undefined> {
    this.stats.getTransactionCount++
    return await rpcWithRetries(
      async () => {
        return (
          (await this.provider.getTransaction(transactionHash.toString())) ??
          undefined
        )
      },
      () => `getTransaction ${transactionHash.toString()}`,
    )
  }

  async getDebugTrace(
    transactionHash: Hash256,
  ): Promise<DebugTransactionCallResponse> {
    this.stats.getDebugTraceCount++
    return await rpcWithRetries(
      async () => {
        const response = await this.provider.send('debug_traceTransaction', [
          transactionHash.toString(),
          { tracer: 'callTracer' },
        ])
        return DebugTransactionCallResponse.parse(response)
      },
      () => `debug_traceTransaction ${transactionHash.toString()}`,
    )
  }

  async getBytecode(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<Bytes> {
    this.stats.getBytecodeCount++
    return await rpcWithRetries(
      async () => {
        const result = await this.provider.getCode(
          address.toString(),
          blockNumber,
        )
        return Bytes.fromHex(result)
      },
      () => `getCode ${address.toString()} ${blockNumber}`,
    )
  }

  async getSource(address: EthereumAddress): Promise<ContractSource> {
    this.stats.getSourceCount++
    return await this.etherscanClient.getContractSource(address)
  }

  async getDeployment(
    address: EthereumAddress,
  ): Promise<ContractDeployment | undefined> {
    this.stats.getDeploymentCount++
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
  }

  async getBlock(blockNumber: number): Promise<providers.Block> {
    this.stats.getBlockCount++
    return await rpcWithRetries(
      async () => {
        return await this.provider.getBlock(blockNumber)
      },
      () => `getBlock ${blockNumber}`,
    )
  }

  async getBlockNumber(): Promise<number> {
    this.stats.getBlockNumberCount++
    return await rpcWithRetries(
      async () => {
        return await this.provider.getBlockNumber()
      },
      () => `getBlockNumber`,
    )
  }

  async getBlobs(txHash: string): Promise<BlobsInBlock> {
    assert(
      this.blobClient,
      'BlobClient is not available, configure the .env to include beacon url.',
    )
    return await this.blobClient.getRelevantBlobs(txHash)
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
