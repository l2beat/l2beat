import { EtherscanClient, HttpClient } from '@l2beat/shared'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

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
    getEnv('ETHERSCAN_API_KEY'),
    new UnixTime(0),
  )
}
