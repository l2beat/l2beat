import { z } from 'zod'

const Response = z.object({
  results: z.array(
    z.object({
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
    return parsed.results[0]?.text_signature
  }
}
