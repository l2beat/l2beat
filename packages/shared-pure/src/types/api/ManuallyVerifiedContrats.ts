import { z } from 'zod'

import { stringAs } from '../branded'
import { EthereumAddress } from '../EthereumAddress'

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
