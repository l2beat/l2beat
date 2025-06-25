import { v } from '@l2beat/validate'
import type { SignatureClient } from './SignatureClient'

const Response = v.object({
  results: v.array(v.object({ id: v.number(), text_signature: v.string() })),
})

export class FourByteClient implements SignatureClient {
  getName(): string {
    return '4byte'
  }

  async getSignature(selector: string): Promise<string> {
    const url = `https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=${selector}`
    const res = await fetch(url)
    const data = await res.json()
    const parsed = Response.parse(data)

    const lowestIdResult = parsed.results.sort((a, b) => a.id - b.id)[0]
    return lowestIdResult?.text_signature
  }

  async getSignatures(selectors: string[]): Promise<Record<string, string>> {
    const results: Record<string, string> = {}
    for (const selector of selectors) {
      const signature = await this.getSignature(selector)
      results[selector] = signature ?? ''
    }
    return results
  }
}
