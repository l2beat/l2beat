import { assert } from '@l2beat/shared-pure'
import { toFunctionSelector } from 'viem'
import { decodeAddress } from '../../../config/address'
import type { Address, Chain, DiscoveredConfig } from '../../../config/types'
import type { AlchemyClient } from '../../../third-party/AlchemyClient'
import type {
  ContractInfo,
  EtherscanClient,
} from '../../../third-party/EtherscanClient'

export interface FunctionAbi {
  selector: `0x${string}`
  signature: string
}

export interface AddressInfo {
  address: Address
  name?: string
  explorerLink: string
  eoa?: boolean
  unverified?: boolean
  fromDiscovery?: boolean
  token?: {
    name: string
    decimals: number
  }
  abi: FunctionAbi[]
}

export interface IAddressService {
  lookup(address: Address): Promise<AddressInfo>
}

export class AddressService implements IAddressService {
  constructor(
    private alchemyClient: AlchemyClient,
    private etherscanClient: EtherscanClient,
    private discovered: DiscoveredConfig,
    private tokens: Record<Address, { name: string; decimals: number }>,
    private chains: Chain[],
  ) {}

  async lookup(address: Address): Promise<AddressInfo> {
    const token = this.tokens[address]
    const [shortChainName, noprefix] = decodeAddress(address)

    const chain = this.chains.find((x) => x.shortName === shortChainName)
    assert(chain, `No chain found for ${shortChainName}`)

    const [isEoa, contractInfo] = await Promise.all([
      this.alchemyClient.hasNoCode(noprefix, chain),
      chain.etherscanApi
        ? this.etherscanClient.getContractInfo(chain.chainId, noprefix)
        : undefined,
    ])

    let implementationInfo: ContractInfo | undefined
    if (contractInfo?.implementation) {
      implementationInfo = await this.etherscanClient.getContractInfo(
        chain.chainId,
        contractInfo?.implementation,
      )
    }

    const discoveryName = this.discovered.names[address]
    const discoveryAbi = this.discovered.abis[address]

    const abi = (contractInfo?.abi ?? [])
      .concat(implementationInfo?.abi ?? [])
      .concat(discoveryAbi ?? [])
      .filter((x) => x.startsWith('function '))
      .filter((x, i, a) => a.indexOf(x) === i)
      .map(
        (x): FunctionAbi => ({
          selector: toFunctionSelector(x),
          signature: x,
        }),
      )

    const unverified =
      !isEoa &&
      ((contractInfo && !contractInfo.verified) ||
        (implementationInfo && !implementationInfo.verified))

    const name =
      discoveryName ||
      implementationInfo?.name ||
      contractInfo?.name ||
      undefined

    return {
      address,
      name,
      eoa: isEoa,
      fromDiscovery: !!discoveryName || !!discoveryAbi,
      unverified,
      token,
      explorerLink: `${chain.explorerUrl}/address/${noprefix}`,
      abi,
    }
  }
}
