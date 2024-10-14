import { assert } from '@l2beat/shared-pure'
import { z } from 'zod'

export const RpcResponse = z.object({
  result: z.union([z.string(), z.number(), z.record(z.string(), z.any())]),
})

export const Quantity = {
  decode: z.preprocess((s) => {
    const res = z.string().parse(s)
    assert(res.startsWith('0x'), 'Quantity should start with 0x')
    assert(res !== '0x', 'Zero should be represented as 0x0')
    if (res.startsWith('0x0') && res.length !== 3) {
      throw new Error('No leading zeroes allowed')
    }
    return parseInt(res, 16)
  }, z.number().int()),

  encode: (n: number) => `0x${n.toString(16)}`,
}

export type Block = z.infer<typeof Block>
export const Block = z.object({
  // TODO: add support for including txs body
  transactions: z.array(z.string()),
  timestamp: Quantity.decode,
  hash: z.string(),
  number: Quantity.decode,
})
