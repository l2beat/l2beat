import { EtherscanLikeClient, HttpClient, Logger } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'

export class DiscoveryEtherscanLikeClient extends EtherscanLikeClient {
  constructor(
    http: HttpClient,
    url: string,
    apiKey: string,
    logger = Logger.SILENT,
  ) {
    // DiscoveryProvider only uses getContractCode and getContractDeploymentTx from EtherscanLikeClient
    // so we can pass 0 as minTimestamp
    super(http, url, apiKey, new UnixTime(0), logger)
  }
}
