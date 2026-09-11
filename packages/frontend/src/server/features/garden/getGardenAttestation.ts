import type { GardenAttestation } from '~/pages/garden/components/AttestationNotice'
import { getAttestationsMeta } from './getCropsProjects'

export async function getGardenAttestation(): Promise<
  GardenAttestation | undefined
> {
  const { current } = await getAttestationsMeta()
  if (!current) {
    return undefined
  }
  return {
    revision: current.revision,
    reviewedAt: current.reviewedAt,
    projectCount: current.projectIds.length,
    explorerUrl: current.explorerUrl,
  }
}
