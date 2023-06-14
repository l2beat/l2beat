import { EtherscanClient } from '@l2beat/shared'
import { Bytes, EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { jsonToHumanReadableAbi } from './jsonToHumanReadableAbi'

export interface ContractMetadata {
  name: string
  isVerified: boolean
  abi: string[]
  source: string
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
  ) {}

  async call(
    address: EthereumAddress,
    data: Bytes,
    blockNumber: number,
  ): Promise<Bytes> {
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
    const result = await this.provider.getStorageAt(
      address.toString(),
      slot instanceof Bytes ? slot.toString() : slot,
      blockNumber,
    )
    return Bytes.fromHex(result)
  }

  async getLogs(
    address: EthereumAddress,
    topics: (string | string[])[],
    fromBlock: number,
    toBlock: number,
  ): Promise<providers.Log[]> {
    return this.provider.getLogs({
      address: address.toString(),
      fromBlock,
      toBlock,
      topics,
    })
  }

  async getTransaction(transactionHash: Hash256) {
    return this.provider.getTransaction(transactionHash.toString())
  }

  async getCode(address: EthereumAddress, blockNumber: number): Promise<Bytes> {
    const result = await this.provider.getCode(address.toString(), blockNumber)
    return Bytes.fromHex(result)
  }

  async getMetadata(address: EthereumAddress): Promise<ContractMetadata> {
    const result = await this.etherscanClient.getContractSource(address)
    const isVerified = result.ABI !== 'Contract source code not verified'

    return {
      name: result.ContractName.trim(),
      isVerified,
      abi: isVerified ? jsonToHumanReadableAbi(result.ABI) : [],
      source: result.SourceCode,
    }
  }

  async getContractDeploymentTx(address: EthereumAddress) {
    return this.etherscanClient.getContractDeploymentTx(address)
  }

  async getDeployer(address: EthereumAddress) {
    const txHash = await this.getContractDeploymentTx(address)
    const tx = await this.getTransaction(txHash)

    return EthereumAddress(tx.from)
  }
}
