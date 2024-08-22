import { z } from 'zod'

const Response = z.object({
  results: z.array(
    z.object({
      id: z.number(),
      text_signature: z.string(),
    }),
  ),
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
