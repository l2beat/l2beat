import { EthereumAddress, Hash256, stringAs } from '@l2beat/shared-pure'
import { z } from 'zod'

export type ShapeSchema = z.infer<typeof ShapeSchema>
export const ShapeSchema = z.object({
  hash: stringAs(Hash256),
  description: z.string(),
  address: stringAs(EthereumAddress),
  chain: z.string(),
  blockNumber: z.number(),
})
