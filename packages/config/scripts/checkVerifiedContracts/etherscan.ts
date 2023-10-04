import { getEnv } from '@l2beat/backend-tools'
import { EtherscanClient, HttpClient } from '@l2beat/shared'
import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

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
    getEnv().string('ETHERSCAN_API_KEY'),
    new UnixTime(0),
  )
}
