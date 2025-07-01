import { RateLimiter } from '@l2beat/backend-tools'
import { v } from '@l2beat/validate'
import { formatAbi } from 'abitype'

export interface ContractInfo {
  verified: boolean
  name: string
  abi: string[]
  implementation?: `0x${string}`
}

export class EtherscanClient {
  private rateLimiter = new RateLimiter({ callsPerMinute: 240 })

  constructor(private apikey: string) {
    this.getContractInfo = this.rateLimiter.wrap(
      this.getContractInfo.bind(this),
    )
  }

  async getContractInfo(
    chainId: number,
    address: `0x${string}`,
  ): Promise<ContractInfo> {
    const source = await this.getContractSource(chainId, address)
    const verified = !source.ABI.includes('not verified')
    return {
      verified,
      name: source.ContractName,
      abi: verified ? toHumanAbi(source.ABI) : [],
      implementation: source.Implementation
        ? (source.Implementation as `0x${string}`)
        : undefined,
    }
  }

  async getContractSource(
    chainId: number,
    address: `0x${string}`,
  ): Promise<ContractSource> {
    const base = 'https://api.etherscan.io/v2/api'
    const query = new URLSearchParams({
      chainid: chainId.toString(),
      module: 'contract',
      action: 'getsourcecode',
      address: address,
      apikey: this.apikey,
    })
    const url = `${base}?${query}`
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    })
    const json = await res.json()
    const parsed = Schema.safeParse(json)
    if (!parsed.success) {
      throw new Error('Cannot parse Etherscan response')
    }
    if (parsed.data.status !== '1') {
      throw new Error(
        `Etherscan error: ${parsed.data.message}: ${parsed.data.result}`,
      )
    }
    return parsed.data.result[0]
  }
}

function toHumanAbi(abi: string): string[] {
  try {
    const json = JSON.parse(abi)
    return formatAbi(json) as string[]
  } catch {
    return []
  }
}

const ErrorSchema = v.object({
  status: v.literal('0'),
  message: v.string(),
  result: v.unknown(),
})

export type ContractSource = v.infer<typeof ContractSource>
const ContractSource = v.object({
  SourceCode: v.string(),
  ABI: v.string(),
  ContractName: v.string(),
  CompilerVersion: v.string(),
  OptimizationUsed: v.string(),
  Runs: v.string(),
  ConstructorArguments: v.string(),
  EVMVersion: v.string(),
  Library: v.string(),
  LicenseType: v.string(),
  Proxy: v.string(),
  Implementation: v.string(),
  SwarmSource: v.string(),
})

const SuccessSchema = v.object({
  status: v.literal('1'),
  message: v.string(),
  result: v.tuple([ContractSource]),
})

const Schema = v.union([ErrorSchema, SuccessSchema])
