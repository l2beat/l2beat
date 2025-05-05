import { Logger, RateLimiter } from '@l2beat/backend-tools'
import {
  type EthereumAddress,
  Hash256,
  Retries,
  type UnixTime,
} from '@l2beat/shared-pure'

import type { ContractSource, IEtherscanClient } from './IEtherscanClient'

import type { HttpClient } from '@l2beat/shared'

import { utils } from 'ethers'
import { z } from 'zod'

const URL = 'https://sourcify.dev/server'

class SourcifyError extends Error {}

const shouldRetry = Retries.exponentialBackOff({
  stepMs: 2000, // 4s, 8s, 16s, 32s, 64s, 128s, 256s, 512s, 1024s, 2048s
  maxAttempts: 10,
  maxDistanceMs: Infinity,
  notifyAfterAttempts: Infinity,
})

export class SourcifyClient implements IEtherscanClient {
  protected readonly rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })
  protected readonly timeoutMs = 20_000

  constructor(
    protected readonly httpClient: HttpClient,
    protected readonly chainId: number,
    protected readonly logger = Logger.SILENT,
  ) {
    this.callWithRetries = this.rateLimiter.wrap(
      this.callWithRetries.bind(this),
    )
  }

  async getContractSource(address: EthereumAddress): Promise<ContractSource> {
    const response = await this.callWithRetries(address.toString())

    if (!response) {
      return {
        name: '',
        isVerified: false,
        abi: [],
        solidityVersion: '',
        constructorArguments: '',
        files: {},
        remappings: [],
      }
    }

    const result = SourcifySourceSchema.parse(response)

    const files = decodeSourcifySource(
      result.compilation.name,
      result.sources,
      result.compilation.compilerVersion,
    )

    const abi = toHumanReadableAbi(result.abi)

    return {
      name: result.compilation.name,
      isVerified: true,
      abi,
      solidityVersion: result.compilation.compilerVersion,
      constructorArguments:
        result.creationBytecode.transformationValues?.constructorArguments ??
        '',
      remappings: result.compilation.compilerSettings.remappings,
      files,
    }
  }

  async getContractDeploymentTx(
    address: EthereumAddress,
  ): Promise<Hash256 | undefined> {
    const response = await this.callWithRetries(address.toString())

    if (!response) {
      return undefined
    }

    const result = SourcifySourceSchema.parse(response)

    if (!result.deployment.transactionHash) {
      return undefined
    }

    return Hash256(result.deployment.transactionHash)
  }

  async callWithRetries(address: string): Promise<unknown> {
    let attempts = 0
    while (true) {
      try {
        return await this.call(address)
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

  private async call(address: string): Promise<unknown | null> {
    const fields = [
      'abi',
      'sources',
      'compilation',
      'creationBytecode',
      'deployment',
    ]
    const url = `${URL}/v2/contract/${this.chainId}/${address}?fields=${fields.join(',')}`

    const response = await this.httpClient.fetchRaw(url, {
      timeout: this.timeoutMs,
    })

    // Not verified
    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new SourcifyError(
        `HTTP error: ${response.status} ${response.statusText}`,
      )
    }

    const json = await response.json()

    return json
  }

  getFirstTxTimestamp(_address: EthereumAddress): Promise<UnixTime> {
    throw new Error(notImplementedMessage('getFirstTxTimestamp'))
  }

  getAtMost10RecentOutgoingTxs(
    _address: EthereumAddress,
    _blockNumber: number,
  ): Promise<{ input: string; to: EthereumAddress; hash: Hash256 }[]> {
    throw new Error(notImplementedMessage('getAtMost10RecentOutgoingTxs'))
  }

  getBlockNumberAtOrBefore(_timestamp: UnixTime): Promise<number> {
    throw new Error(notImplementedMessage('getBlockNumberAtOrBefore'))
  }
}

function toHumanReadableAbi(abi: SourcifyAbi) {
  return new utils.Interface(abi as string[]).format(
    utils.FormatTypes.full,
  ) as string[]
}

function decodeSourcifySource(
  name: string,
  sources: SourcifySources,
  solidityVersion: string,
) {
  const amountOfSources = Object.keys(sources).length

  if (amountOfSources === 1) {
    const extension = solidityVersion.startsWith('vyper') ? 'vy' : 'sol'
    // biome-ignore lint/style/noNonNullAssertion: we've checked the length
    const onlySource = Object.values(sources)[0]!

    return {
      [`${name}.${extension}`]: onlySource.content,
    }
  }

  return Object.fromEntries(
    Object.entries(sources).map(([name, { content }]) => [name, content]),
  )
}

const SourcifyAbiSchema = z.array(z.unknown())
type SourcifyAbi = z.infer<typeof SourcifyAbiSchema>

const SourcifySourcesSchema = z.record(
  z.string(),
  z.object({
    content: z.string(),
  }),
)
type SourcifySources = z.infer<typeof SourcifySourcesSchema>

const SourcifySourceSchema = z.object({
  abi: SourcifyAbiSchema,
  compilation: z.object({
    language: z.string(),
    compiler: z.string(),
    compilerVersion: z.string(),
    compilerSettings: z.object({
      remappings: z.array(z.string()),
    }),
    name: z.string(),
  }),
  creationBytecode: z.object({
    transformationValues: z
      .object({
        constructorArguments: z.string().optional(),
      })
      .nullable(),
  }),
  sources: z.record(
    // name
    z.string(),
    z.object({
      // source code
      content: z.string(),
    }),
  ),
  deployment: z.object({
    transactionHash: z.string().nullable(),
  }),
})

function notImplementedMessage(feature: string) {
  return `Sourcify feature not implemented: sourcify only supports source code fetching. ${feature} is not supported by this explorer.`
}
