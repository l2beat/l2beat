import { getEnv } from '@l2beat/backend-tools'
import { BlockIndexerClient, HttpClient } from '@l2beat/shared'
import { assert, Bytes, EthereumAddress } from '@l2beat/shared-pure'
import { providers } from 'ethers'

import { chains } from '../../src'
import { ContractSourceResult } from './types'

export type AddressVerificationStatus = 'verified' | 'unverified' | 'EOA'

export async function isContractVerified(
  etherscanClient: BlockIndexerClient,
  provider: providers.JsonRpcProvider,
  address: EthereumAddress,
): Promise<AddressVerificationStatus> {
  const response = await etherscanClient.call('contract', 'getsourcecode', {
    address: address.toString(),
  })

  const parsed = ContractSourceResult.parse(response)[0]

  if (parsed.SourceCode === '') {
    const code = await provider.getCode(address.toString())
    const isEOA = Bytes.fromHex(code).length === 0
    return isEOA ? 'EOA' : 'unverified'
  }
  return 'verified'
}

export function getEtherscanClient(chain: string): BlockIndexerClient {
  const env = getEnv()
  const chainConfig = chains.find((c) => c.name === chain)
  assert(chainConfig, `No chain config for chain: ${chain}`)
  assert(chainConfig.explorerApi?.url, `No explorerUrl for chain: ${chain}`)
  assert(
    chainConfig.explorerApi.type === 'etherscan',
    `Unsupported explorer type for chain: ${chain}`,
  )

  const ENV_NAME = chain.toUpperCase()
  const ETHERSCAN_API_KEY = env.string(`${ENV_NAME}_ETHERSCAN_API_KEY`)

  return new BlockIndexerClient(new HttpClient(), {
    type: 'Etherscan',
    apiKey: ETHERSCAN_API_KEY,
    url: chainConfig.explorerApi.url,
    maximumCallsForBlockTimestamp: 1, // not important here
    chain: chainConfig.name,
  })
}

export function getProvider(chain: string): providers.JsonRpcProvider {
  const env = getEnv()
  const ENV_NAME = chain.toUpperCase()
  const chainConfig = chains.find((c) => c.name === chain)
  const rpcUrl = env.string([
    `${ENV_NAME}_RPC_URL_FOR_DISCOVERY`,
    `${ENV_NAME}_RPC_URL`,
    //support for legacy local configs
    `DISCOVERY_${ENV_NAME}_RPC_URL`,
  ])
  return new providers.StaticJsonRpcProvider(rpcUrl, chainConfig?.chainId)
}
