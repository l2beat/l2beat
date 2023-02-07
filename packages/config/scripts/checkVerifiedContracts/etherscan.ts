import { EthereumAddress, EtherscanClient, HttpClient } from '@l2beat/shared'

import { getEnv } from './utils'

export async function isContractVerified(
  etherscanClient: EtherscanClient,
  address: EthereumAddress,
): Promise<boolean> {
  const resp = await etherscanClient.getContractSource(address)
  return resp.SourceCode !== ''
}

export function getEtherscanClient(): EtherscanClient {
  return new EtherscanClient(
    new HttpClient(),
    'https://api.etherscan.io/api',
    getEnv('ETHERSCAN_API_KEY'),
  )
}
