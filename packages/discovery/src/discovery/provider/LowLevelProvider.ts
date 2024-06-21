import {
  assert,
  Bytes,
  EthereumAddress,
  Hash256,
  UnixTime,
} from '@l2beat/shared-pure'
import { providers } from 'ethers'
import { EtherscanLikeClient } from '../../utils/EtherscanLikeClient'
import { DebugTransactionCallResponse } from './DebugTransactionTrace'
import { ContractDeployment, ContractSource, RawProviders } from './IProvider'
import { ProviderStats, getZeroStats } from './Stats'
import { jsonToHumanReadableAbi } from './jsonToHumanReadableAbi'

export class LowLevelProvider {
  public stats: ProviderStats = getZeroStats()

  constructor(
    private readonly provider: providers.JsonRpcProvider,
    private readonly eventProvider: providers.JsonRpcProvider,
    private readonly etherscanLikeClient: EtherscanLikeClient,
  ) {}

  getRawProviders(): RawProviders {
    return {
      baseProvider: this.provider,
      eventProvider: this.eventProvider,
      etherscanLikeClient: this.etherscanLikeClient,
    }
  }

  async call(
    address: EthereumAddress,
    data: Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    this.stats.callCount++
    const result = await this.provider.call(
      { to: address.toString(), data: data.toString() },
      blockNumber,
    )
    return Bytes.fromHex(result)
  }

  async getStorage(
    address: EthereumAddress,
    slot: number | bigint | Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
    this.stats.getStorageCount++
    const result = await this.provider.getStorageAt(
      address.toString(),
      slot instanceof Bytes ? slot.toString() : slot,
      blockNumber,
    )
    return Bytes.fromHex(result)
  }

  async getLogs(
    address: EthereumAddress,
    topics: (string | string[] | null)[],
    fromBlock: number,
    toBlock: number,
  ) {
    this.stats.getLogsCount++
    return await this.eventProvider.getLogs({
      address: address.toString(),
      fromBlock,
      toBlock,
      topics,
    })
  }

  async getTransaction(
    transactionHash: Hash256,
  ): Promise<providers.TransactionResponse> {
    this.stats.getTransactionCount++
    return await this.provider.getTransaction(transactionHash.toString())
  }

  async getDebugTrace(
    transactionHash: Hash256,
  ): Promise<DebugTransactionCallResponse> {
    this.stats.getDebugTraceCount++
    const response = await this.provider.send('debug_traceTransaction', [
      transactionHash.toString(),
      { tracer: 'callTracer' },
    ])
    return DebugTransactionCallResponse.parse(response)
  }

  async getBytecode(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<Bytes> {
    this.stats.getBytecodeCount++
    const result = await this.provider.getCode(address.toString(), blockNumber)
    return Bytes.fromHex(result)
  }

  async getSource(address: EthereumAddress): Promise<ContractSource> {
    this.stats.getSourceCount++
    const result = await this.etherscanLikeClient.getContractSource(address)
    const isVerified = result.ABI !== 'Contract source code not verified'

    return {
      name: result.ContractName.trim(),
      isVerified,
      abi: isVerified ? jsonToHumanReadableAbi(result.ABI) : [],
      source: result.SourceCode,
      solidityVersion: result.CompilerVersion,
      constructorArguments: result.ConstructorArguments,
    }
  }

  async getDeployment(
    address: EthereumAddress,
  ): Promise<ContractDeployment | undefined> {
    this.stats.getDeploymentCount++
    const transactionHash =
      await this.etherscanLikeClient.getContractDeploymentTx(address)
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
    return await this.provider.getBlock(blockNumber)
  }

  async getBlockNumber(): Promise<number> {
    this.stats.getBlockNumberCount++
    return await this.provider.getBlockNumber()
  }
}
