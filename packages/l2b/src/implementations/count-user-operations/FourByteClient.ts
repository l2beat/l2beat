import { v } from '@l2beat/validate'

const Response = v.object({
  results: v.array(v.object({ id: v.number(), text_signature: v.string() })),
})

export class FourByteClient {
  async getSignature(selector: string): Promise<string | undefined> {
    const url = `https://www.4byte.directory/api/v1/signatures/?format=json&hex_signature=${selector}`
    const res = await fetch(url)
    const data = await res.json()
    const parsed = Response.parse(data)

    const lowestIdResult = parsed.results.sort((a, b) => a.id - b.id)[0]
    return lowestIdResult?.text_signature
  }
}
