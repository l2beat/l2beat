import fetch from 'node-fetch'

import { Cache } from './Cache'

interface FourBytesResult {
  count: number
  results: {
    id: number
    text_signature: string
  }[]
}

export class FourBytesApi {
  private readonly cache = new Cache<string | null>()

  async getMethodSignature(identifier: string) {
    if (identifier.length !== 10) return undefined
    if (!this.cache.has(identifier)) {
      const signature = await this.fetchMethodSignature(identifier)
      this.cache.set(identifier, signature ?? null)
    }
    return this.cache.get(identifier) ?? undefined
  }

  private async fetchMethodSignature(identifier: string) {
    const url = `https://www.4byte.directory/api/v1/signatures/?hex_signature=${identifier}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    const json = (await res.json()) as FourBytesResult
    if (json.count !== 0) {
      // grabbing name with the lowest id
      const [first, ...rest] = json.results
      let min = first
      for (const item of rest) {
        if (item.id < min.id) {
          min = item
        }
      }
      return min.text_signature || undefined
    }
  }
}
