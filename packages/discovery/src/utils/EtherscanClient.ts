import { type Logger, RateLimiter } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import {
  assert,
  EthereumAddress,
  Hash256,
  Retries,
  UnixTime,
} from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'
import {
  ContractCreatorAndCreationTxHashResult,
  ContractSourceResult,
  OneTransactionListResult,
  TransactionListResult,
  tryParseEtherscanResponse,
} from './EtherscanModels'
import type {
  ContractSource,
  EtherscanUnsupportedMethods,
  IEtherscanClient,
} from './IEtherscanClient'
import { jsonToHumanReadableAbi } from './jsonToHumanReadableAbi'

class EtherscanError extends Error {}

const shouldRetry = Retries.exponentialBackOff({
  stepMs: 2000, // 4s, 8s, 16s, 32s, 64s, 128s, 256s, 512s, 1024s, 2048s
  maxAttempts: 10,
  maxDistanceMs: Number.POSITIVE_INFINITY,
  notifyAfterAttempts: Number.POSITIVE_INFINITY,
})

export class EtherscanClient implements IEtherscanClient {
  protected readonly rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })
  protected readonly timeoutMs = 20_000

  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly logger: Logger,
    protected readonly url: string,
    protected readonly apiKey: string,
    protected readonly minTimestamp: UnixTime,
    protected readonly unsupportedMethods: EtherscanUnsupportedMethods = {},
    protected readonly defaultParams: Record<string, string> = {},
  ) {
    this.callWithRetries = this.rateLimiter.wrap(
      this.callWithRetries.bind(this),
    )
  }

  /**
   * Creates a client that can be used for discovery so does not need a minTimestamp.
   */
  static createForDiscovery(
    httpClient: HttpClient,
    logger: Logger,
    url: string,
    apiKey: string,
    unsupportedMethods: EtherscanUnsupportedMethods = {},
    defaultParams: Record<string, string> = {},
  ): EtherscanClient {
    return new EtherscanClient(
      httpClient,
      logger,
      url,
      apiKey,
      0,
      unsupportedMethods,
      defaultParams,
    )
  }

  // Etherscan API is not stable enough to trust it to return "closest" block.
  // There is a case when there is not enough activity on a given chain
  // so that blocks come in a greater than 10 minutes intervals,
  // e.g block 0 @ 22:45 and block 1 @ 23:15
  // if you query for 23:00 Etherscan API returns "No closes block found".
  //
  // To mitigate this, we need to go back in time by 10 minutes until we find a block
  async getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number> {
    let current = UnixTime(timestamp)

    while (current >= this.minTimestamp) {
      try {
        const result = await this.callWithRetries('block', 'getblocknobytime', {
          timestamp: current.toString(),
          closest: 'before',
        })

        return v
          .string()
          .transform(Number)
          .check(Number.isInteger)
          .parse(result)
      } catch (error) {
        if (typeof error !== 'object') {
          const errorString =
            typeof error === 'string' ? error : 'Unknown error type caught'
          throw new Error(errorString)
        }

        const errorObject = error as EtherscanError
        if (!errorObject.message.includes('No closest block found')) {
          throw new Error(errorObject.message)
        }

        current = current - 10 * UnixTime.MINUTE
      }
    }

    throw new Error('Could not fetch block number')
  }

  private parseContractName(name: string): string {
    if (name.includes(':')) {
      const parts = name.split(':')
      assert(parts.length === 2, 'Expected only a single colon')
      // biome-ignore lint/style/noNonNullAssertion: we know it's there
      return parts[1]!
    }

    return name
  }

  async getContractSource(address: EthereumAddress): Promise<ContractSource> {
    const response = await this.callWithRetries('contract', 'getsourcecode', {
      address: address.toString(),
    })

    const sourceResponse = ContractSourceResult.parse(response)

    const result = sourceResponse[0]
    assert(result)
    const isVerified = result.ABI !== 'Contract source code not verified'

    let files: Record<string, string> = {}
    let remappings: string[] = []
    const name = result.ContractName.trim()
    const solidityVersion = result.CompilerVersion
    const source = result.SourceCode

    if (isVerified) {
      try {
        const decodedSource = decodeEtherscanSource(
          name,
          source,
          solidityVersion,
        )
        files = Object.fromEntries(decodedSource.sources)
        remappings = decodedSource.remappings
      } catch (e) {
        this.logger.error(e)
      }
    }

    return {
      name: this.parseContractName(name),
      isVerified,
      abi: isVerified ? jsonToHumanReadableAbi(result.ABI) : [],
      solidityVersion,
      constructorArguments: result.ConstructorArguments,
      remappings,
      files,
    }
  }

  // Returns undefined if the method is not supported by API.
  async getContractDeploymentTx(
    address: EthereumAddress,
  ): Promise<Hash256 | undefined> {
    if (this.unsupportedMethods.getContractCreation) {
      return undefined
    }

    const response = await this.callWithRetries(
      'contract',
      'getcontractcreation',
      {
        contractaddresses: address.toString(),
      },
    )

    const tx = ContractCreatorAndCreationTxHashResult.parse(response)[0]

    assert(tx?.txHash)

    return tx.txHash
  }

  async getFirstTxTimestamp(address: EthereumAddress): Promise<UnixTime> {
    const response = await this.callWithRetries('account', 'txlist', {
      address: address.toString(),
      startblock: '0',
      endblock: '999999999',
      page: '1',
      offset: '1',
      sort: 'asc',
    })

    const resp = OneTransactionListResult.parse(response)[0]
    assert(resp)

    return UnixTime(Number.parseInt(resp.timeStamp, 10))
  }

  async getAtMost10RecentOutgoingTxs(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<{ input: string; to: EthereumAddress; hash: Hash256 }[]> {
    const response = await this.callWithRetries('account', 'txlist', {
      address: address.toString(),
      startblock: '0',
      endblock: blockNumber.toString(),
      page: '1',
      offset: '50',
      sort: 'desc',
    })

    const resp = TransactionListResult.parse(response)
    const outgoingTxs = resp
      .filter((tx) => EthereumAddress(tx.from) === address)
      .slice(0, 10)

    return outgoingTxs.map((r) => ({
      input: r.input,
      to: EthereumAddress(r.to),
      hash: Hash256(r.hash),
    }))
  }

  async callWithRetries(
    module: string,
    action: string,
    params: Record<string, string>,
  ): Promise<unknown> {
    let attempts = 0
    while (true) {
      try {
        return await this.callRaw(module, action, params)
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

  private async callRaw(
    module: string,
    action: string,
    params: Record<string, string>,
  ): Promise<unknown> {
    const queryParams = {
      ...this.defaultParams,
      ...params,
    }

    const query = new URLSearchParams({
      module,
      action,
      ...queryParams,
      apikey: this.apiKey,
    })
    const url = `${this.url}?${query.toString()}`

    const response = await this.httpClient.fetch(url, {
      timeout: this.timeoutMs,
    })

    const etherscanResponse = tryParseEtherscanResponse(response)

    if (!etherscanResponse) {
      const message = `Invalid Etherscan response [${JSON.stringify(response)}] for request [${url}].`
      throw new TypeError(message)
    }

    if (etherscanResponse.message !== 'OK') {
      throw new EtherscanError(etherscanResponse.result)
    }

    return etherscanResponse.result
  }
}

const Sources = v.record(v.string(), v.object({ content: v.string() }))
const Settings = v.object({ remappings: v.array(v.string()).optional() })
const EtherscanSource = v.object({ sources: Sources, settings: Settings })

interface DecodedSource {
  sources: [string, string][]
  remappings: string[]
}

function decodeEtherscanSource(
  name: string,
  source: string,
  solidityVersion: string,
): DecodedSource {
  source = source.trim()
  if (!source.startsWith('{')) {
    let extension = 'sol'
    if (solidityVersion.startsWith('vyper')) {
      extension = 'vy'
    }

    return {
      sources: [[`${name}.${extension}`, source]],
      remappings: [],
    }
  }

  // etherscan sometimes wraps the json in {} so you get {{...}}
  if (source.startsWith('{{')) {
    source = source.slice(1, -1)
  }

  const parsed: unknown = JSON.parse(source)
  let validated: Record<string, { content: string }>
  let remappings: string[] = []
  try {
    const verified = EtherscanSource.parse(parsed)
    validated = verified.sources
    remappings = verified.settings.remappings ?? []
  } catch {
    validated = Sources.parse(parsed)
  }

  return {
    sources: Object.entries(validated).map(([name, { content }]) => [
      name,
      content,
    ]),
    remappings,
  }
}
