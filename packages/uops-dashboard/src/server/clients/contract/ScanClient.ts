import { v as v } from '@l2beat/validate'
import type { ContractClient } from './ContractClient'

const Response = v.object({
  message: v.string(),
  result: v.array(v.object({ ContractName: v.string() })),
})

export class ScanClient implements ContractClient {
  constructor(
    private readonly apiUrl: string,
    private readonly apiKey: string,
    private readonly chainId: string,
  ) {}

  async getName(address: string): Promise<string> {
    const url = `${this.apiUrl}/api?module=contract&action=getsourcecode&address=${address}&apikey=${this.apiKey}&chainId=${this.chainId}`

    const res = await fetch(url)

    if (!res.ok) {
      return ''
    }

    const data = await res.json()
    const parsed = Response.parse(data)

    if (parsed.message !== 'OK') {
      return ''
    }

    return parsed.result[0].ContractName
  }
}
