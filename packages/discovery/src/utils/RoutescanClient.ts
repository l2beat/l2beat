import { type Logger, redactUrl } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import type { UnixTime } from '@l2beat/shared-pure'
import { callWithBackoff, isPermanentHttpError } from './callWithBackoff'
import { EtherscanClient } from './EtherscanClient'
import { tryParseEtherscanResponse } from './EtherscanModels'
import type {
  EtherscanUnsupportedMethods,
  IEtherscanClient,
} from './IEtherscanClient'

class RoutescanError extends Error {}

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
    return await callWithBackoff(
      () => this.callRoutescan(module, action, params),
      {
        random: Math.random,
        isPermanentError: isPermanentHttpError,
        retryCallback: (attempts, error) => {
          this.logger.warn('Retrying', { attempts, error })
        },
      },
    )
  }

  private async callRoutescan(
    module: string,
    action: string,
    params: Record<string, string>,
  ): Promise<unknown> {
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
      throw new TypeError('Invalid Routescan response', {
        cause: { url: redactUrl(url), response },
      })
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
