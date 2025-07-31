import { Logger, RateLimiter } from '@l2beat/backend-tools'
import type { HttpClient } from '@l2beat/shared'
import {
  assert,
  EthereumAddress,
  Hash256,
  type json,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  BlockscoutGetBlockNoByTime,
  ContractCreatorAndCreationTxHashResult,
  ContractSourceResult,
  OneTransactionListResult,
  parseBlockscoutResponse,
  TransactionListResult,
  UnverifiedContractSourceResult,
} from './BlockscoutModels'
import type {
  ContractSource,
  EtherscanUnsupportedMethods,
  IEtherscanClient,
} from './IEtherscanClient'
import { jsonToHumanReadableAbi } from './jsonToHumanReadableAbi'

class BlockscoutError extends Error {}
const MAXIMUM_CALLS_FOR_BLOCK_TIMESTAMP = 10

export class BlockscoutClient implements IEtherscanClient {
  private readonly rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })
  private readonly timeoutMs = 20_000

  constructor(
    private readonly httpClient: HttpClient,
    private readonly url: string,
    private readonly unsupportedMethods: EtherscanUnsupportedMethods = {},
    private readonly logger = Logger.SILENT,
  ) {
    this.call = this.rateLimiter.wrap(this.call.bind(this))
    this.logger = logger.for(this)
  }

  static create(
    services: { httpClient: HttpClient; logger: Logger },
    options: {
      url: string
      unsupportedMethods?: EtherscanUnsupportedMethods
    },
  ) {
    return new BlockscoutClient(
      services.httpClient,
      options.url,
      options.unsupportedMethods ?? {},
      services.logger,
    )
  }

  async getBlockNumberAtOrBefore(timestamp: UnixTime): Promise<number> {
    let current = UnixTime(timestamp)

    let counter = 1
    while (counter <= MAXIMUM_CALLS_FOR_BLOCK_TIMESTAMP) {
      try {
        const result = await this.call('block', 'getblocknobytime', {
          timestamp: current.toString(),
          closest: 'before',
        })

        return BlockscoutGetBlockNoByTime.parse(result).blockNumber
      } catch (error) {
        if (typeof error !== 'object') {
          const errorString =
            typeof error === 'string' ? error : 'Unknown error type caught'
          throw new Error(errorString)
        }

        const errorObject = error as BlockscoutError
        if (!errorObject.message.includes('Block does not exist')) {
          throw new Error(errorObject.message)
        }

        current = current - 1 * UnixTime.MINUTE
      }

      counter++
    }

    throw new Error('Could not fetch block number', {
      cause: {
        current,
        timestamp,
        calls: MAXIMUM_CALLS_FOR_BLOCK_TIMESTAMP,
      },
    })
  }

  async getContractSource(address: EthereumAddress): Promise<ContractSource> {
    const response = await this.call('contract', 'getsourcecode', {
      address: address.toString(),
    })

    const sourceResponse = ContractSourceResult.safeParse(response)
    if (sourceResponse.success === false) {
      const unverifiedSource =
        UnverifiedContractSourceResult.safeParse(response)
      assert(unverifiedSource.success)

      return {
        name: '',
        isVerified: false,
        abi: [],
        solidityVersion: '',
        constructorArguments: '',
        remappings: [],
        files: {},
      }
    }

    const result = sourceResponse.data?.[0]
    assert(result)
    const files: Record<string, string> = {}
    files[result.FileName] = result.SourceCode
    for (const file of result.AdditionalSources ?? []) {
      // NOTE(radomski): Blockscout API returns filenames with a leading
      // single quote. Potentially an error with string escaping on their
      // end.
      const filename = file.Filename.startsWith("'")
        ? file.Filename.slice(1)
        : file.Filename
      files[filename] = file.SourceCode
    }

    return {
      name: result.ContractName.trim(),
      isVerified: true,
      abi: jsonToHumanReadableAbi(result.ABI),
      solidityVersion: result.CompilerVersion,
      constructorArguments: '',
      remappings: result.CompilerSettings?.remappings ?? [],
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

    const response = await this.call('contract', 'getcontractcreation', {
      contractaddresses: address.toString(),
    })

    const parsed = ContractCreatorAndCreationTxHashResult.safeParse(response)
    if (parsed.success === false) {
      return Hash256.ZERO
    }

    const tx = parsed.data?.[0]
    assert(tx?.txHash)

    return tx.txHash
  }

  async getFirstTxTimestamp(address: EthereumAddress): Promise<UnixTime> {
    const response = await this.call('account', 'txlist', {
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
    const response = await this.call('account', 'txlist', {
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

  async call(module: string, action: string, params: Record<string, string>) {
    const query = new URLSearchParams({
      module,
      action,
      ...params,
    })
    const url = `${this.url}?${query.toString()}`

    const response = await this.httpClient.fetch(url, {
      timeout: this.timeoutMs,
    })

    const blockscoutResponse = tryParseBlockscoutResponse(response)

    if (!blockscoutResponse) {
      const message = `Invalid Blockscout response [${JSON.stringify(response)}] for request [${url}].`
      throw new TypeError(message)
    }

    if (blockscoutResponse.message !== 'OK') {
      throw new BlockscoutError(blockscoutResponse.result)
    }

    return blockscoutResponse.result
  }
}

function tryParseBlockscoutResponse(response: json) {
  try {
    return parseBlockscoutResponse(response)
  } catch {
    return undefined
  }
}
