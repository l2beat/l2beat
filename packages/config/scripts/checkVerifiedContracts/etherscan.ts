import { getEnv } from '@l2beat/backend-tools'
import { EtherscanClient, HttpClient } from '@l2beat/shared'
import { assert, EthereumAddress } from '@l2beat/shared-pure'

import { chains } from '../../src'
import { ContractSourceResult } from './types'

export async function isContractVerified(
  etherscanClient: EtherscanClient,
  address: EthereumAddress,
): Promise<boolean> {
  const response = await etherscanClient.call('contract', 'getsourcecode', {
    address: address.toString(),
  })

  const parsed = ContractSourceResult.parse(response)[0]

  return parsed.SourceCode !== ''
}

export function getEtherscanClient(chain: string): EtherscanClient {
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

  return new EtherscanClient(new HttpClient(), {
    type: 'Etherscan',
    apiKey: ETHERSCAN_API_KEY,
    url: chainConfig.explorerApi.url,
    maximumCallsForBlockTimestamp: 1, // not important here
  })
}
