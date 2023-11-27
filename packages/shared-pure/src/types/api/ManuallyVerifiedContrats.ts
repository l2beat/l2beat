import { z } from 'zod'

const ETHEREUM_ADDRESS_REGEX = /0x[a-fA-F0-9]{40}/

const ethereumAddressSchema = z
  .string()
  .refine((address) => ETHEREUM_ADDRESS_REGEX.test(address), {
    message: 'The key must be a valid Ethereum address',
  })

export const ManuallyVerifiedContracts = z.record(
  ethereumAddressSchema,
  z.string().url(),
)
export type ManuallyVerifiedContracts = z.infer<
  typeof ManuallyVerifiedContracts
>
