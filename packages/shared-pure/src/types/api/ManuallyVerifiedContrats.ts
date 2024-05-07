import { z } from 'zod'

import { EthereumAddress } from '../EthereumAddress'
import { stringAs } from '../branded'

export const ManuallyVerifiedContractsPerChain = z.record(
  stringAs(EthereumAddress).transform((address) => address.toString()),
  z.string().url(),
)
export type ManuallyVerifiedContractsPerChain = z.infer<
  typeof ManuallyVerifiedContractsPerChain
>

export type ManuallyVerifiedContracts = Partial<
  Record<string, ManuallyVerifiedContractsPerChain>
>
