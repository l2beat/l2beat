import {
  Bytes,
  EthereumAddress,
  EtherscanClient,
  Hash256,
} from '@l2beat/shared'
import { providers } from 'ethers'

import { jsonToHumanReadableAbi } from './jsonToHumanReadableAbi'

export interface ContractMetadata {
  name: string
  isVerified: boolean
  abi: string[]
}

/**
 * This class is meant as a wrapper for all interactions with the blockchain
 * and Etherscan for the purposes of discovery.
 *
 * The ultimate goal is for it to automatically handle batching, rate limiting,
 * error parsing and more low level stuff, so that the rest of the code can
 * remain simple and not worry about things like 429 Too Many Requests.
 *
 * It also has a set block number that will be kept constant.
 */
export class DiscoveryProvider {
  constructor(
    private readonly provider: providers.Provider,
    private readonly etherscanClient: EtherscanClient,
    readonly blockNumber: number,
  ) {}

  async call(address: EthereumAddress, data: Bytes): Promise<Bytes> {
    const result = await this.provider.call(
      { to: address.toString(), data: data.toString() },
      this.blockNumber,
    )
    return Bytes.fromHex(result)
  }

  async getStorage(
    address: EthereumAddress,
    slot: number | bigint | Bytes,
  ): Promise<Bytes> {
    const result = await this.provider.getStorageAt(
      address.toString(),
      slot instanceof Bytes ? slot.toString() : slot,
      this.blockNumber,
    )
    return Bytes.fromHex(result)
  }

  async getLogs(
    address: EthereumAddress,
    topics: (string | string[])[],
    fromBlock = 0,
  ): Promise<providers.Log[]> {
    return this.provider.getLogs({
      address: address.toString(),
      fromBlock,
      toBlock: this.blockNumber,
      topics,
    })
  }

  async getTransaction(transactionHash: Hash256) {
    return this.provider.getTransaction(transactionHash.toString())
  }

  async getCode(address: EthereumAddress): Promise<Bytes> {
    const result = await this.provider.getCode(
      address.toString(),
      this.blockNumber,
    )
    return Bytes.fromHex(result)
  }

  async getMetadata(address: EthereumAddress): Promise<ContractMetadata> {
    const result = await this.etherscanClient.getContractSource(address)
    const isVerified = result.ABI !== 'Contract source code not verified'

    return {
      name: result.ContractName,
      isVerified,
      abi: isVerified ? jsonToHumanReadableAbi(result.ABI) : [],
    }
  }
}
