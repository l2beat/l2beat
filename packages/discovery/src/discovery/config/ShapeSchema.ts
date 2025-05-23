import { EthereumAddress, Hash256, stringAs } from '@l2beat/shared-pure'
import { z } from 'zod/v4'

export type ShapeSchema = z.infer<typeof ShapeSchema>
export const ShapeSchema = z.record(
  z.string(),
  z.object({
    hash: stringAs(Hash256),
    address: stringAs(EthereumAddress),
    chain: z.string(),
    blockNumber: z.number(),
  }),
)
