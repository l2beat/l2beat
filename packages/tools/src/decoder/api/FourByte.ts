import { v } from '@l2beat/validate'

const Response = v.object({
  results: v.array(
    v.object({
      id: v.number(),
      text_signature: v.string(),
    }),
  ),
})

const API_URL = 'https://www.4byte.directory/api/v1/signatures/'

export async function get4ByteSignatures(selector: string): Promise<string[]> {
  const query = new URLSearchParams({ format: 'json', hex_signature: selector })
  const res = await fetch(`${API_URL}?${query}`)
  const data = await res.json()
  const parsed = Response.parse(data)
  return parsed.results.sort((a, b) => a.id - b.id).map((r) => r.text_signature)
}
