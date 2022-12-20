import { assert, EtherscanClient } from '@l2beat/common'
import { EthereumAddress } from '@l2beat/types'
import { ProjectParameters } from '../types'
import { ContractMetadata } from './DiscoveryProvider'
import { jsonToHumanReadableAbi } from './jsonToHumanReadableAbi'

export interface MetadataProvider {
  getMetadata(address: EthereumAddress): Promise<ContractMetadata>
}

export class EtherscanMetadataProvider implements MetadataProvider {
  constructor(private readonly etherscanClient: EtherscanClient) {}

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

export class LocalMetadataProvider implements MetadataProvider {
  constructor(private readonly discoveryResult: ProjectParameters) {}

  async getMetadata(address: EthereumAddress): Promise<ContractMetadata> {
    // note: not all contracts will be stored in discoveryResults.contracts. For example implementations of proxies are omitted
    const contract = this.discoveryResult.contracts.find(
      (c) => c.address === address,
    )

    const abi = this.discoveryResult.abis[address.toString()] ?? []

    return {
      name: contract?.name || 'Unknown',
      isVerified: !contract?.unverified,
      abi,
    }
  }
}
