import { z } from 'zod'

const Response = z.object({
  ok: z.boolean(),
  result: z.object({
    function: z.record(
      z
        .array(
          z.object({
            name: z.string(),
            filtered: z.boolean(),
          }),
        )
        .nullable(),
    ),
  }),
})

const API_URL = 'https://api.openchain.xyz/signature-database/v1/lookup'

async function getManyOpenChainSignatures(
  selectors: string[],
): Promise<Record<string, string[]>> {
  const query = new URLSearchParams({ function: selectors.join(',') })
  const res = await fetch(`${API_URL}?${query}`)
  const data = await res.json()
  const parsed = Response.parse(data)
  if (!parsed.ok) {
    throw new Error('Response ok = false')
  }

  const results: Record<string, string[]> = {}
  for (const [selector, functions] of Object.entries(parsed.result.function)) {
    results[selector] = functions?.map((f) => f.name) ?? []
  }
  return results
}

export async function getOpenChainSignatures(
  selector: string,
): Promise<string[]> {
  const results = await getManyOpenChainSignatures([selector])
  return results[selector] ?? []
}
