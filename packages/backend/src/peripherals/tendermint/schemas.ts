import { v as z } from '@l2beat/validate'

export const TendermintValidatorsResponseBodySchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.number().check(Number.isInteger),
  result: z
    .object({
      block_height: z.string().transform((x) => Number.parseInt(x)),
      validators: z.array(
        z.object({
          address: z.string(),
          pub_key: z.object({
            type: z.string(),
            value: z.string(),
          }),
          voting_power: z.string().transform((x) => Number.parseInt(x)),
          proposer_priority: z.string().transform((x) => Number.parseInt(x)),
        }),
      ),
      count: z.string().transform((x) => Number.parseInt(x)),
      total: z.string().transform((x) => Number.parseInt(x)),
    })
    .transform((x) => ({
      blockHeight: x.block_height,
      validators: x.validators.map((v) => ({
        address: v.address,
        pubKey: {
          type: v.pub_key.type,
          value: v.pub_key.value,
        },
        votingPower: v.voting_power,
        proposerPriority: v.proposer_priority,
      })),
      count: x.count,
      total: x.total,
    })),
})

export type TendermintValidatorsResponseBodySchema = z.infer<
  typeof TendermintValidatorsResponseBodySchema
>
