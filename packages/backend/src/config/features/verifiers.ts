import type { ProjectService } from '@l2beat/config'
import type { VerifiersConfig } from '../Config'

export async function getVerifiersConfig(
  ps: ProjectService,
): Promise<VerifiersConfig> {
  const projects = await ps.getProjects({
    select: ['proofVerification'],
    whereNot: ['isArchived'],
  })
  return {
    verifiers: projects.flatMap((p) => p.proofVerification.verifiers),
  }
}
