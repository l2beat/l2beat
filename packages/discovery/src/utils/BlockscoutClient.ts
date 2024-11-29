import { Logger, RateLimiter } from '@l2beat/backend-tools'
import {
  assert,
  EthereumAddress,
  Hash256,
  UnixTime,
  getErrorMessage,
} from '@l2beat/shared-pure'

import { ContractSource } from './IEtherscanClient'

import {
  BlockscoutGetBlockNoByTime,
  ContractCreatorAndCreationTxHashResult,
  ContractSourceResult,
  OneTransactionListResult,
  TwentyTransactionListResult,
  UnverifiedContractSourceResult,
  parseBlockscoutResponse,
} from './BlockscoutModels'
import { HttpClient } from './HttpClient'
import {
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
    let current = new UnixTime(timestamp.toNumber())

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

        current = current.add(-1, 'minutes')
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
    for (const file of result.AdditionalSources) {
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
      remappings: result.CompilerSettings.remappings ?? [],
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

    return new UnixTime(parseInt(resp.timeStamp, 10))
  }

  async getLast10OutgoingTxs(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<{ input: string; to: EthereumAddress; hash: Hash256 }[]> {
    const response = await this.call('account', 'txlist', {
      address: address.toString(),
      startblock: '0',
      endblock: blockNumber.toString(),
      page: '1',
      offset: '20',
      sort: 'desc',
    })

    const resp = TwentyTransactionListResult.parse(response)
    assert(resp)
    const outgoingTxs = resp
      .filter((tx) => EthereumAddress(tx.from) === address)
      .slice(0, 10)

    assert(
      outgoingTxs.length === 10,
      'Not enough outgoing transactions, expected 10, received ' +
        outgoingTxs.length.toString(),
    )

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

    const start = Date.now()
    const { httpResponse, error } = await this.httpClient
      .fetch(url, { timeout: this.timeoutMs })
      .then(
        (httpResponse) => ({ httpResponse, error: undefined }),
        (error: unknown) => ({ httpResponse: undefined, error }),
      )
    const timeMs = Date.now() - start

    if (!httpResponse) {
      const message = getErrorMessage(error)
      this.recordError(module, action, timeMs, message)
      throw error
    }

    const text = await httpResponse.text()
    const blockscoutResponse = tryParseBlockscoutResponse(text)

    if (!httpResponse.ok) {
      this.recordError(module, action, timeMs, text)
      throw new Error(
        `Server responded with non-2XX result: ${httpResponse.status}`,
      )
    }

    if (!blockscoutResponse) {
      const message = `Invalid Blockscout response [${text}] for request [${url}].`
      this.recordError(module, action, timeMs, message)
      throw new TypeError(message)
    }

    if (blockscoutResponse.message !== 'OK') {
      this.recordError(module, action, timeMs, blockscoutResponse.result)
      throw new BlockscoutError(blockscoutResponse.result)
    }

    this.logger.debug({ type: 'success', timeMs, module, action })
    return blockscoutResponse.result
  }

  private recordError(
    module: string,
    action: string,
    timeMs: number,
    message: string,
  ) {
    this.logger.debug({ type: 'error', message, timeMs, module, action })
  }
}

function tryParseBlockscoutResponse(text: string) {
  try {
    return parseBlockscoutResponse(text)
  } catch {
    return undefined
  }
}
