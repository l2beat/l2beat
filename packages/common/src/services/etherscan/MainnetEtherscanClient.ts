import { HttpClient } from '../HttpClient'
import { EtherscanClient } from './EtherscanClient'

export class MainnetEtherscanClient extends EtherscanClient {
  static API_URL = 'https://api.etherscan.io/api'

  constructor(httpClient: HttpClient, apiKey: string) {
    super(httpClient, MainnetEtherscanClient.API_URL, apiKey)
  }
}
