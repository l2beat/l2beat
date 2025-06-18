import { v } from '@l2beat/validate'

export class FourByteClient {
  async lookup(selector: `0x${string}`): Promise<string[]> {
    const base = 'https://www.4byte.directory/api/v1/signatures/'
    const query = new URLSearchParams({
      hex_signature: selector,
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
      throw new Error('Cannot parse FourByte response')
    }
    return parsed.data.results
      .sort((a, b) => a.id - b.id)
      .map((x) => `function ${x.text_signature}`)
  }
}

const Schema = v.object({
  results: v.array(v.object({ id: v.number(), text_signature: v.string() })),
})
