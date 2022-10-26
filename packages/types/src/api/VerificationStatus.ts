import z from 'zod'

export const VerificationStatus = z.object({
  projects: z.record(z.boolean()),
  contracts: z.record(z.boolean()),
})
export type VerificationStatus = z.infer<typeof VerificationStatus>
