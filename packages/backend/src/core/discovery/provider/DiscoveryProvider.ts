import { EtherscanClient, getErrorMessage } from '@l2beat/common'
import { Bytes, EthereumAddress } from '@l2beat/types'
import { providers } from 'ethers'
import { getProviderErrorMessage } from './getProviderErrorMessage'
import { jsonToHumanReadableAbi } from './jsonToHumanReadableAbi'

export type Result<T> = SuccessResult<T> | ErrorResult

export interface SuccessResult<T> {
  isSuccess: true
  value: T
}

export interface ErrorResult {
  isSuccess: false
  error: string
}

export interface ContractMetadata {
  name: string
  isVerified: boolean
  sourceCode: string
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

  async call(address: EthereumAddress, data: Bytes): Promise<Result<Bytes>> {
    try {
      const result = await this.provider.call(
        { to: address.toString(), data: data.toString() },
        this.blockNumber,
      )
      return { isSuccess: true, value: Bytes.fromHex(result) }
    } catch (e) {
      return { isSuccess: false, error: getProviderErrorMessage(e) }
    }
  }

  async getStorage(
    address: EthereumAddress,
    slot: Bytes | number,
  ): Promise<Result<Bytes>> {
    try {
      const result = await this.provider.getStorageAt(
        address.toString(),
        slot instanceof Bytes ? slot.toString() : slot,
        this.blockNumber,
      )
      return { isSuccess: true, value: Bytes.fromHex(result) }
    } catch (e) {
      return { isSuccess: false, error: getProviderErrorMessage(e) }
    }
  }

  async getLogs(
    address: EthereumAddress,
    topics: string[][],
    fromBlock = 0,
  ): Promise<Result<providers.Log[]>> {
    try {
      const result = await this.provider.getLogs({
        address: address.toString(),
        fromBlock,
        toBlock: this.blockNumber,
        topics,
      })
      return { isSuccess: true, value: result }
    } catch (e) {
      return { isSuccess: false, error: getProviderErrorMessage(e) }
    }
  }

  async getCode(address: EthereumAddress): Promise<Result<Bytes>> {
    try {
      const result = await this.provider.getCode(
        address.toString(),
        this.blockNumber,
      )
      return { isSuccess: true, value: Bytes.fromHex(result) }
    } catch (e) {
      return { isSuccess: false, error: getProviderErrorMessage(e) }
    }
  }

  async getMetadata(
    address: EthereumAddress,
  ): Promise<Result<ContractMetadata>> {
    try {
      const result = await this.etherscanClient.getContractSource(address)
      const isVerified = result.ABI === 'Contract source code not verified'

      return {
        isSuccess: true,
        value: {
          name: result.ContractName,
          isVerified,
          abi: isVerified ? jsonToHumanReadableAbi(result.ABI) : [],
          sourceCode: result.SourceCode,
        },
      }
    } catch (e) {
      return { isSuccess: false, error: getErrorMessage(e) }
    }
  }
}
