import z from 'zod'

export const ProjectsVerificationStatuses = z.record(z.optional(z.boolean()))
export type ProjectsVerificationStatuses = z.infer<
  typeof ProjectsVerificationStatuses
>

export const ContractsVerificationStatuses = z.record(
  z.optional(z.record(z.optional(z.boolean()))),
)
export type ContractsVerificationStatuses = z.infer<
  typeof ContractsVerificationStatuses
>

// TODO: Should be deleted after https://linear.app/l2beat/issue/L2B-6497/refactor-verification-status is done
export const VerificationStatus = z.object({
  projects: ProjectsVerificationStatuses,
  contracts: ContractsVerificationStatuses,
})
export type VerificationStatus = z.infer<typeof VerificationStatus>
