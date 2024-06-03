import z from 'zod'
import { UnixTime } from '../UnixTime'
import { branded } from '../branded'

export const VerifierStatus = z.object({
  address: z.string(),
  timestamp: branded(z.number().nullable(), (n) =>
    n ? new UnixTime(n) : null,
  ),
})

export type VerifierStatus = z.infer<typeof VerifierStatus>

export const VerifiersApiResponse = z.array(VerifierStatus)

export type VerifiersApiResponse = z.infer<typeof VerifiersApiResponse>
