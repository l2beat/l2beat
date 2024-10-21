import { assert } from '@l2beat/shared-pure'
import { z } from 'zod'

export const RpcResponse = z.object({
  result: z.union([z.string(), z.number(), z.record(z.string(), z.any())]),
})

export type EVMTransaction = z.infer<typeof EVMTransaction>
export const EVMTransaction = z.object({
  hash: z.string(),
  to: z.string(),
  data: z.string(),
})

export const Quantity = {
  decode: z.preprocess((s) => {
    const res = z.string().parse(s)
    assert(res.startsWith('0x'), 'Quantity should start with 0x')
    assert(res !== '0x', 'Zero should be represented as 0x0')
    if (res.startsWith('0x0') && res.length !== 3) {
      throw new Error('No leading zeroes allowed')
    }
    return BigInt(res)
  }, z.bigint()),

  encode: (n: bigint) => `0x${n.toString(16)}`,
}

export type EVMBlock = z.infer<typeof EVMBlock>
export const EVMBlock = z.object({
  // TODO: add support for including txs body
  transactions: z.array(EVMTransaction),
  timestamp: Quantity.decode.transform((n) => Number(n)),
  hash: z.string(),
  number: Quantity.decode.transform((n) => Number(n)),
})
