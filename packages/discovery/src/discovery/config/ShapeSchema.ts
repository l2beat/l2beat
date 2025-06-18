import { EthereumAddress, Hash256 } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export type ShapeSchema = v.infer<typeof ShapeSchema>
export const ShapeSchema = v.record(
  v.string(),
  v.object({
    hash: v.string().transform((v) => Hash256(v)),
    address: v.union([
      v.string().transform((a) => EthereumAddress(a)),
      v.array(v.string().transform((a) => EthereumAddress(a))),
    ]),
    chain: v.string(),
    blockNumber: v.number(),
  }),
)
