import { v } from '@l2beat/validate'

const EspressoStakeTableEntry = v.object({
  stake_table_entry: v.object({
    stake_key: v.string(),
    stake_amount: v.string(),
  }),
  state_ver_key: v.string(),
})

export type EspressoStakeTable = v.infer<typeof EspressoStakeTable>
export const EspressoStakeTable = v.object({
  epoch: v.number(),
  stake_table: v.array(EspressoStakeTableEntry),
})
