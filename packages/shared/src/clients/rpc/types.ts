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
    return BigInt(res)
  }, z.bigint()),

  encode: (n: bigint) => `0x${n.toString(16)}`,
}

export type EVMTransaction = z.infer<typeof EVMTransaction>
export const EVMTransaction = z
  .object({
    hash: z.string(),
    from: z.string(),
    /** Address of the receiver, null when its a contract creation transaction. */
    to: z.union([z.string(), z.null()]),
    input: z.string(),
    type: Quantity.decode.transform((n) => Number(n)),
  })
  .transform(({ hash, from, to, input, type }) => ({
    hash,
    from,
    to,
    data: input,
    type,
  }))

export type EVMBlock = z.infer<typeof EVMBlock>
export const EVMBlock = z.object({
  transactions: z.array(EVMTransaction),
  timestamp: Quantity.decode.transform((n) => Number(n)),
  hash: z.string(),
  number: Quantity.decode.transform((n) => Number(n)),
})
