import { z } from 'zod'

import { stringAs } from '../branded'
import { EthereumAddress } from '../EthereumAddress'

export const ManuallyVerifiedContracts = z.record(
  stringAs(EthereumAddress),
  z.string().url(),
)
export type ManuallyVerifiedContracts = z.infer<
  typeof ManuallyVerifiedContracts
>
