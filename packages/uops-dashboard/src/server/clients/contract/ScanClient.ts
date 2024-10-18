import { z } from 'zod'
import type { ContractClient } from './ContractClient'
import { Chain } from '@/chains'
import { getApiKey, getScanUrl } from '../apiUrls'

const Response = z.object({
  message: z.string(),
  result: z.array(
    z.object({
      ContractName: z.string(),
    }),
  ),
})

export class ScanClient implements ContractClient {
  private readonly apiUrl: string
  private readonly apiKey: string

  constructor(private readonly chain: Chain) {
    this.apiUrl = getScanUrl(this.chain.id)
    this.apiKey = getApiKey(this.chain.id, 'SCAN')
  }

  async getName(address: string): Promise<string> {
    const url = `${this.apiUrl}/api?module=contract&action=getsourcecode&address=${address}&apikey=${this.apiKey}`

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
