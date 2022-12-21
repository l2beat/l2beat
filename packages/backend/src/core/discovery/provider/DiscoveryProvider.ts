import { assert, EtherscanClient } from '@l2beat/common'
import { Bytes, EthereumAddress, Hash256 } from '@l2beat/types'
import { providers } from 'ethers'

import { ProjectParameters } from '../types'
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
    readonly blockNumber: number,
    readonly etherscanClient?: EtherscanClient,
    readonly previousDiscovery?: ProjectParameters,
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

  async isEOA(address: EthereumAddress): Promise<boolean> {
    if (this.previousDiscovery) {
      return this.previousDiscovery.eoas.includes(address)
    } else {
      const code = await this.getCode(address)
      return code.length === 0
    }
  }

  async getMetadata(address: EthereumAddress): Promise<ContractMetadata> {
    if (this.previousDiscovery) {
      // note: not all contracts will be stored in discoveryResults.contracts. For example implementations of proxies are omitted
      const contract = this.previousDiscovery.contracts.find(
        (c) => c.address === address,
      )

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const abi = this.previousDiscovery.abis[address.toString()] ?? []

      return {
        name: contract?.name ?? 'Unknown',
        isVerified: !contract?.unverified,
        abi,
      }
    } else {
      assert(this.etherscanClient)
      const result = await this.etherscanClient.getContractSource(address)
      const isVerified = result.ABI !== 'Contract source code not verified'

      return {
        name: result.ContractName,
        isVerified,
        abi: isVerified ? jsonToHumanReadableAbi(result.ABI) : [],
      }
    }
  }
}
