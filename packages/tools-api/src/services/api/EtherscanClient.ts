import { formatAbi } from 'abitype'
import { z } from 'zod'

export interface ContractInfo {
  verified: boolean
  name: string
  abi: string[]
  implementation?: `0x${string}`
}

export class EtherscanClient {
  constructor(private apikey: string) {}

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

const ErrorSchema = z.object({
  status: z.literal('0'),
  message: z.string(),
  result: z.unknown(),
})

export type ContractSource = z.infer<typeof ContractSource>
const ContractSource = z.object({
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

const SuccessSchema = z.object({
  status: z.literal('1'),
  message: z.string(),
  result: z.tuple([ContractSource]),
})

const Schema = z.union([ErrorSchema, SuccessSchema])
