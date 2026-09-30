import { ChainSpecificAddress } from '@l2beat/shared-pure'
import { v } from '@l2beat/validate'

export const AddressKey = v
  .string()
  .transform((v) => ChainSpecificAddress(v).toString())
