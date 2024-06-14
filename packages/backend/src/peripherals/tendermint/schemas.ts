import { z } from 'zod'

export const TendermintValidatorsResponseBodySchema = z.object({
  jsonrpc: z.literal('2.0'),
  id: z.number().int(),
  result: z.object({
    block_height: z.number().int(),
    validators: z.array(
      z.object({
        address: z.string(),
        pub_key: z.object({
          type: z.string(),
          value: z.string(),
        }),
        voting_power: z.string().transform((x) => parseInt(x)),
        proposer_priority: z.string().transform((x) => parseInt(x)),
      }),
    ),
    count: z.string().transform((x) => parseInt(x)),
    total: z.string().transform((x) => parseInt(x)),
  }),
})

export type TendermintValidatorsResponseBodySchema = z.infer<
  typeof TendermintValidatorsResponseBodySchema
>
