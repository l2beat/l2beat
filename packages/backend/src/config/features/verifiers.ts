import type { ProjectService } from '@l2beat/config'
import type { VerifiersConfig } from '../Config'

export async function getVerifiersConfig(
  ps: ProjectService,
): Promise<VerifiersConfig> {
  const verifiers = await ps.getProjects({
    select: ['proofVerification'],
    whereNot: ['archivedAt'],
  })
  const chains = await ps.getProjects({
    select: ['chainConfig'],
  })
  return {
    verifiers: verifiers.flatMap((p) => p.proofVerification.verifiers),
    chains: chains.map((p) => p.chainConfig),
  }
}
