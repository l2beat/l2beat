import { v } from '@l2beat/validate'
import type { SignatureClient } from './SignatureClient'

const SignatureResponse = v.object({
  items: v.array(v.object({ id: v.number(), text: v.string() })),
})

const SourcesResponse = v.object({
  items: v.array(
    v.object({
      id: v.number(),
      name: v.string(),
      html_url: v.string(),
    }),
  ),
})

const API_URL = 'https://api.etherface.io/v1'

export class EtherfaceClient implements SignatureClient {
  getName(): string {
    return 'Etherface'
  }

  async getSignature(selector: string): Promise<string> {
    const url = `${API_URL}/signatures/hash/function/${selector}/1`

    const res = await fetch(url)

    if (!res.ok) {
      return ''
    }

    const data = await res.json()
    const parsed = SignatureResponse.parse(data)

    if (parsed.items.length === 0) {
      return ''
    }

    const lowestIdResult = parsed.items.sort((a, b) => a.id - b.id)[0]

    return lowestIdResult.text
  }

  async getSignatures(selectors: string[]): Promise<Record<string, string>> {
    const results: Record<string, string> = {}
    for (const selector of selectors) {
      const signature = await this.getSignature(selector)
      results[selector] = signature ?? ''
    }
    return results
  }

  private async getContractName(id: number): Promise<string> {
    const url = `${API_URL}/sources/github/all/${id}/1`
    const res = await fetch(url)
    const data = await res.json()
    const parsed = SourcesResponse.parse(data)

    if (parsed.items.length === 0) {
      return ''
    }

    const lowestIdResult = parsed.items.sort((a, b) => a.id - b.id)[0]

    return lowestIdResult.name
  }
}
