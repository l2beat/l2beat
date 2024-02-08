import { getEnv } from '@l2beat/backend-tools'
import { EtherscanClient, HttpClient } from '@l2beat/shared'
import { assert, ChainId, EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { chains } from '../../src'

export async function isContractVerified(
  etherscanClient: EtherscanClient,
  address: EthereumAddress,
): Promise<boolean> {
  const resp = await etherscanClient.getContractSource(address)
  return resp.SourceCode !== ''
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

  return new EtherscanClient(
    new HttpClient(),
    chainConfig.explorerApi.url,
    ETHERSCAN_API_KEY,
    new UnixTime(0),
    ChainId(chainConfig.chainId),
  )
}
