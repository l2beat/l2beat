import { getEnv } from '@l2beat/backend-tools'
import { EtherscanLikeClient, HttpClient } from '@l2beat/shared'
import { assert, EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { chainsByDevId } from '../../src'

export async function isContractVerified(
  etherscanClient: EtherscanLikeClient,
  address: EthereumAddress,
): Promise<boolean> {
  const resp = await etherscanClient.getContractSource(address)
  return resp.SourceCode !== ''
}

export function getEtherscanClient(devId: string): EtherscanLikeClient {
  const env = getEnv()
  const chainConfig = chainsByDevId.get(devId)
  assert(chainConfig, `No chain config for devId: ${devId}`)
  assert(chainConfig.explorerApi?.url, `No explorerUrl for devId: ${devId}`)
  assert(
    chainConfig.explorerApi.type === 'etherscan',
    `Unsupported explorer type for devId: ${devId}`,
  )

  const ENV_NAME = devId.toUpperCase()
  const ETHERSCAN_API_KEY = env.string(`${ENV_NAME}_ETHERSCAN_API_KEY`)

  return new EtherscanLikeClient(
    new HttpClient(),
    chainConfig.explorerApi.url,
    ETHERSCAN_API_KEY,
    new UnixTime(0),
  )
}
