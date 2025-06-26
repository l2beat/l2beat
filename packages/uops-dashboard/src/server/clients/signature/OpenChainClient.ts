import { v } from '@l2beat/validate'
import type { SignatureClient } from './SignatureClient'

const Response = v.object({
  ok: v.boolean(),
  result: v.object({
    function: v.record(
      v.string(),
      v.union([
        v.array(v.object({ name: v.string(), filtered: v.boolean() })),
        v.null(),
      ]),
    ),
  }),
})

const API_URL = 'https://api.openchain.xyz/signature-database/v1/lookup'

export class OpenChainClient implements SignatureClient {
  getName(): string {
    return 'OpenChain'
  }

  async getSignature(selector: string): Promise<string> {
    const results = await this.getSignatures([selector])
    return results[selector][0] ?? ''
  }

  async getSignatures(selectors: string[]): Promise<Record<string, string>> {
    const query = new URLSearchParams({ function: selectors.join(',') })
    const res = await fetch(`${API_URL}?${query}`)
    const data = await res.json()
    const parsed = Response.parse(data)
    if (!parsed.ok) {
      throw new Error('OpenChainClient - bad response')
    }

    const results: Record<string, string> = {}
    for (const [selector, functions] of Object.entries(
      parsed.result.function,
    )) {
      results[selector] = functions?.[0].name ?? ''
    }

    return results
  }
}
