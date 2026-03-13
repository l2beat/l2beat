import { v } from '@l2beat/validate'

export type EspressoStakeTable = v.infer<typeof EspressoStakeTable>
export const EspressoStakeTable = v.object({
  stake_table: v.array(
    v.object({
      stake_table_entry: v.object({
        stake_amount: v.string(),
      }),
    }),
  ),
})

export const EspressoError = v.object({
  Custom: v.object({
    message: v.string(),
    status: v.number(),
  }),
})
