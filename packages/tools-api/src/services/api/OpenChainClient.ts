import { z } from 'zod'

export class OpenChainClient {
  async lookup(selector: `0x${string}`): Promise<string[]> {
    const many = await this.lookupMany([selector])
    return many[selector] ?? []
  }

  async lookupMany(
    selectors: `0x${string}`[],
  ): Promise<Record<`0x${string}`, string[]>> {
    const base = 'https://api.openchain.xyz/signature-database/v1/lookup'
    const query = new URLSearchParams({
      filter: 'true',
      function: selectors.join(','),
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
      throw new Error('Cannot parse OpenChain response')
    }
    if (!parsed.data.ok) {
      throw new Error(parsed.data.error)
    }
    const fns = parsed.data.result.function
    return Object.fromEntries(
      selectors.map((s) => [s, fns[s]?.map((f) => `function ${f.name}`) ?? []]),
    )
  }
}

const ErrorSchema = z.object({
  ok: z.literal(false),
  error: z.string(),
})

const SuccessSchema = z.object({
  ok: z.literal(true),
  result: z.object({
    function: z.record(
      z.union([
        z.array(
          z.object({
            name: z.string(),
            filtered: z.boolean(),
          }),
        ),
        z.null(),
      ]),
    ),
  }),
})

const Schema = z.union([ErrorSchema, SuccessSchema])
