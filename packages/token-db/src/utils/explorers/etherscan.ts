import { RateLimiter } from '@l2beat/backend-tools'
import { z } from 'zod'
import { Cache } from '../cache/types.js'

type Serializable = { toString: () => string }

function buildKeyWithPrefix(prefix: number) {
  return (invocation: string, params: Serializable[]) => {
    const result = [prefix, invocation, ...params.map((p) => p.toString())]

    return result.join('.')
  }
}

export function buildEtherscanExplorer(apiUrl: string, apiKey: string) {
  const rateLimiter = new RateLimiter({
    callsPerMinute: 150,
  })

  async function call(
    module: string,
    action: string,
    params: Record<string, string>,
  ) {
    const query = new URLSearchParams({
      module,
      action,
      ...params,
      apikey: apiKey,
    })
    const url = `${apiUrl}?${query.toString()}`

    const res = await fetch(url)
    const json = await res.json()
    const response = EtherscanResponse.parse(json)

    return response
  }

  const rateLimitedCall = rateLimiter.wrap(call)

  async function getContractDeployment(address: `0x${string}`) {
    const response = await rateLimitedCall('contract', 'getcontractcreation', {
      contractaddresses: address,
    })
    if (response.message === 'No data found') {
      return undefined
    }
    if (response.message !== 'OK') {
      throw new Error(`Unexpected response: ${response.message}`)
    }
    // biome-ignore lint/style/noNonNullAssertion: enforced by zod
    return GetContractCreationResult.parse(response.result)[0]!
  }

  async function getContractSource(address: `0x${string}`) {
    const response = await rateLimitedCall('contract', 'getsourcecode', {
      address,
    })
    if (response.message === 'No data found') {
      return undefined
    }
    if (response.message !== 'OK') {
      if (response.result === 'Contract source code not verified') {
        return undefined
      }
      throw new Error(`Unexpected response: ${response.message}`)
    }
    // biome-ignore lint/style/noNonNullAssertion: enforced by zod
    return GetSourceCodeResult.parse(response.result)[0]!
  }

  async function getInternalTransactions(
    address: `0x${string}`,
    fromBlock: number,
    toBlock: number,
  ) {
    const response = await call('account', 'txlistinternal', {
      address,
      startblock: fromBlock.toString(),
      endblock: toBlock.toString(),
    })

    return GetInternalTransactionsResult.parse(response.result)
  }

  return {
    getContractDeployment,
    getContractSource,
    getInternalTransactions,
  }
}

export function buildCachedEtherscanExplorer(
  apiUrl: string,
  apiKey: string,
  cache: Cache,
  chainId: number,
): ReturnType<typeof buildEtherscanExplorer> {
  const rawClient = buildEtherscanExplorer(apiUrl, apiKey)

  const buildKey = buildKeyWithPrefix(chainId)

  async function getContractDeployment(address: `0x${string}`) {
    const key = buildKey('getContractDeployment', [address])
    const cached = await cache.get(key)

    if (cached) {
      return JSON.parse(cached)
    }

    const result = await rawClient.getContractDeployment(address)

    if (result) {
      await cache.set(key, JSON.stringify(result), chainId)
    }

    return result
  }

  async function getContractSource(address: `0x${string}`) {
    const key = buildKey('getContractSource', [address])
    const cached = await cache.get(key)

    if (cached) {
      return JSON.parse(cached)
    }

    const result = await rawClient.getContractSource(address)

    if (result) {
      await cache.set(key, JSON.stringify(result), chainId)
    }

    return result
  }

  async function getInternalTransactions(
    address: `0x${string}`,
    fromBlock: number,
    toBlock: number,
  ) {
    const key = buildKey('getInternalTransactions', [
      address,
      fromBlock,
      toBlock,
    ])
    const cached = await cache.get(key)

    if (cached) {
      return JSON.parse(cached)
    }

    const result = await rawClient.getInternalTransactions(
      address,
      fromBlock,
      toBlock,
    )

    await cache.set(key, JSON.stringify(result), chainId, toBlock)

    return result
  }

  return {
    getContractDeployment,
    getContractSource,
    getInternalTransactions,
  }
}

export type EtherscanResponse = z.infer<typeof EtherscanResponse>
const EtherscanResponse = z.object({
  message: z.string(),
  result: z.unknown().optional(),
})

export type ContractCreatorAndCreationTxHash = z.infer<
  typeof ContractCreatorAndCreationTxHash
>
export const ContractCreatorAndCreationTxHash = z.object({
  contractAddress: z.string(),
  contractCreator: z.string(),
  txHash: z.string(),
})

export const GetContractCreationResult = z
  .array(ContractCreatorAndCreationTxHash)
  .length(1)

export type ContractSource = z.infer<typeof ContractSource>
export const ContractSource = z.object({
  SourceCode: z.string(),
  ABI: z.string(),
  ContractName: z.string(),
  CompilerVersion: z.string(),
  OptimizationUsed: z.string(),
  Runs: z.string(),
  ConstructorArguments: z.string(),
  EVMVersion: z.string(),
  Library: z.string(),
  LicenseType: z.string(),
  Proxy: z.string(),
  Implementation: z.string(),
  SwarmSource: z.string(),
})

export const GetSourceCodeResult = z.array(ContractSource).length(1)

export const EtherscanInternalTransaction = z.object({
  blockNumber: z.string(),
  timeStamp: z.string(),
  hash: z.string(),
  from: z.string(),
  to: z.string(),
  value: z.string(),
  contractAddress: z.string(),
  input: z.string(),
  type: z.string(),
  gas: z.string(),
  gasUsed: z.string(),
  traceId: z.string(),
  isError: z.string(),
  errCode: z.string(),
})
export type EtherscanInternalTransaction = z.infer<
  typeof EtherscanInternalTransaction
>

export const GetInternalTransactionsResult = z.array(
  EtherscanInternalTransaction,
)
export type GetInternalTransactionsResult = z.infer<
  typeof GetInternalTransactionsResult
>
