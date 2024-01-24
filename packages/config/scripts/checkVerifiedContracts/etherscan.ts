import { getEnv } from '@l2beat/backend-tools'
import { EtherscanLikeClient, HttpClient } from '@l2beat/shared'
import { assert, EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { chains } from '../../src'

export async function isContractVerified(
  etherscanClient: EtherscanLikeClient,
  address: EthereumAddress,
): Promise<boolean> {
  const resp = await etherscanClient.getContractSource(address)
  return resp.SourceCode !== ''
}

export function getEtherscanClient(chain: string): EtherscanLikeClient {
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

  return new EtherscanLikeClient(
    new HttpClient(),
    chainConfig.explorerApi.url,
    ETHERSCAN_API_KEY,
    new UnixTime(0),
  )
}
