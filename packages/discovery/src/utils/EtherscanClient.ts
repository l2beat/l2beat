import { Logger, RateLimiter } from '@l2beat/backend-tools'
import {
  assert,
  EthereumAddress,
  Hash256,
  Retries,
  UnixTime,
  stringAsInt,
} from '@l2beat/shared-pure'

import { ContractSource } from './IEtherscanClient'

import { z } from 'zod'
import {
  ContractCreatorAndCreationTxHashResult,
  ContractSourceResult,
  OneTransactionListResult,
  TwentyTransactionListResult,
  tryParseEtherscanResponse,
} from './EtherscanModels'
import { HttpClient } from './HttpClient'
import {
  EtherscanUnsupportedMethods,
  IEtherscanClient,
} from './IEtherscanClient'
import { getErrorMessage } from './getErrorMessage'
import { jsonToHumanReadableAbi } from './jsonToHumanReadableAbi'

class EtherscanError extends Error {}

const shouldRetry = Retries.exponentialBackOff({
  stepMs: 2000, // 4s, 8s, 16s, 32s, 64s, 128s, 256s, 512s, 1024s, 2048s
  maxAttempts: 10,
  maxDistanceMs: Infinity,
  notifyAfterAttempts: Infinity,
})

export class EtherscanClient implements IEtherscanClient {
  protected readonly rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })
  protected readonly timeoutMs = 20_000

  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly url: string,
    protected readonly apiKey: string,
    protected readonly minTimestamp: UnixTime,
    protected readonly unsupportedMethods: EtherscanUnsupportedMethods = {},
    protected readonly logger = Logger.SILENT,
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
    url: string,
    apiKey: string,
    unsupportedMethods: EtherscanUnsupportedMethods = {},
  ): EtherscanClient {
    return new EtherscanClient(
      httpClient,
      url,
      apiKey,
      new UnixTime(0),
      unsupportedMethods,
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
    let current = new UnixTime(timestamp.toNumber())

    while (current.gte(this.minTimestamp)) {
      try {
        const result = await this.callWithRetries('block', 'getblocknobytime', {
          timestamp: current.toString(),
          closest: 'before',
        })

        return stringAsInt().parse(result)
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

        current = current.add(-10, 'minutes')
      }
    }

    throw new Error('Could not fetch block number')
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
        console.error(e)
        console.log(source)
      }
    }

    return {
      name,
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

    return new UnixTime(parseInt(resp.timeStamp, 10))
  }

  async getLast10OutgoingTxs(
    address: EthereumAddress,
    blockNumber: number,
  ): Promise<{ input: string; to: EthereumAddress; hash: Hash256 }[]> {
    // NOTE(radomski): There is a retry here because Etherscan sometimes
    // responds with 200, no error, everything is supposed to be fine but the
    // amount of txs they returns is less then expected. This happens every
    // so often, but makes our UpdateMonitor channel rife with processing
    // errors
    let attempts = 0
    while (true) {
      try {
        const response = await this.callWithRetries('account', 'txlist', {
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
    const query = new URLSearchParams({
      module,
      action,
      ...params,
      apikey: this.apiKey,
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
    const etherscanResponse = tryParseEtherscanResponse(text)

    if (!httpResponse.ok) {
      this.recordError(module, action, timeMs, text)
      throw new Error(
        `Server responded with non-2XX result: ${httpResponse.status} ${httpResponse.statusText}`,
      )
    }

    if (!etherscanResponse) {
      const message = `Invalid Etherscan response [${text}] for request [${url}].`
      this.recordError(module, action, timeMs, message)
      throw new TypeError(message)
    }

    if (etherscanResponse.message !== 'OK') {
      this.recordError(module, action, timeMs, etherscanResponse.result)
      throw new EtherscanError(etherscanResponse.result)
    }

    this.logger.debug({ type: 'success', timeMs, module, action })
    return etherscanResponse.result
  }

  protected recordError(
    module: string,
    action: string,
    timeMs: number,
    message: string,
  ): void {
    this.logger.debug({ type: 'error', message, timeMs, module, action })
  }
}

const Sources = z.record(z.object({ content: z.string() }))
const Settings = z.object({ remappings: z.array(z.string()).optional() })
const EtherscanSource = z.object({ sources: Sources, settings: Settings })

export interface DecodedSource {
  sources: [string, string][]
  remappings: string[]
}

function decodeEtherscanSource(
  name: string,
  source: string,
  solidityVersion: string,
): DecodedSource {
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
