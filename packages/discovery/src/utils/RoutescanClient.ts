import type { Logger } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import { Retries, type UnixTime } from '@l2beat/shared-pure'
import { EtherscanClient } from './EtherscanClient'
import { tryParseEtherscanResponse } from './EtherscanModels'
import type {
  EtherscanUnsupportedMethods,
  IEtherscanClient,
} from './IEtherscanClient'

class RoutescanError extends Error {}

const shouldRetry = Retries.exponentialBackOff({
  stepMs: 2000, // 4s, 8s, 16s, 32s, 64s, 128s, 256s, 512s, 1024s, 2048s
  maxAttempts: 10,
  maxDistanceMs: Number.POSITIVE_INFINITY,
  notifyAfterAttempts: Number.POSITIVE_INFINITY,
})

export class RoutescanClient
  extends EtherscanClient
  implements IEtherscanClient
{
  constructor(
    httpClient: HttpClient,
    logger: Logger,
    url: string,
    minTimestamp: UnixTime,
    unsupportedMethods: EtherscanUnsupportedMethods = {},
  ) {
    super(httpClient, logger, url, '', minTimestamp, unsupportedMethods, {})
  }

  /**
   * Creates a client that can be used for discovery so does not need a minTimestamp.
   */
  static override createForDiscovery(
    httpClient: HttpClient,
    logger: Logger,
    url: string,
    _apiKey: string,
    unsupportedMethods: EtherscanUnsupportedMethods = {},
  ): RoutescanClient {
    return new RoutescanClient(httpClient, logger, url, 0, unsupportedMethods)
  }

  public override async callWithRetries(
    module: string,
    action: string,
    params: Record<string, string>,
  ): Promise<unknown> {
    let attempts = 0
    while (true) {
      try {
        const query = new URLSearchParams({
          module,
          action,
          ...params,
          apikey: this.apiKey,
        })
        const url = `${this.url}?${query.toString()}`

        const response = await this.httpClient.fetch(url, {
          timeout: this.timeoutMs,
        })

        const etherscanResponse = tryParseEtherscanResponse(response)

        if (!etherscanResponse) {
          const message = `Invalid Routescan response [${JSON.stringify(response)}] for request [${url}].`
          throw new TypeError(message)
        }

        // PATCH POINT
        // Handle the specific case where Routescan returns NOTOK with "Contract source code is not verified"
        // They've been fixing this for past two years.
        if (
          etherscanResponse.message === 'NOTOK' &&
          etherscanResponse.result === 'Contract source code not verified'
        ) {
          return EtherscanContractSourceCodeNotVerified
        }

        if (etherscanResponse.message !== 'OK') {
          throw new RoutescanError(etherscanResponse.result)
        }

        return etherscanResponse.result
      } catch (error) {
        attempts++
        const result = shouldRetry(attempts, error)
        if (result.shouldStop) {
          throw error
        }
        this.logger.warn('Retrying', { attempts, error })
        await new Promise((resolve) => setTimeout(resolve, result.executeAfter))
      }
    }
  }
}

const EtherscanContractSourceCodeNotVerified = [
  {
    SourceCode: '',
    ABI: 'Contract source code not verified',
    ContractName: '',
    CompilerVersion: '',
    CompilerType: '',
    OptimizationUsed: '',
    Runs: '',
    ConstructorArguments: '',
    EVMVersion: 'Default',
    Library: '',
    LicenseType: 'Unknown',
    Proxy: '0',
    Implementation: '',
    SwarmSource: '',
    SimilarMatch: '',
  },
]
