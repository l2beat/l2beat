import { measureOssificationBand } from '@l2beat/shared/frontend'
import { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import { compareByCuratedOrder } from '~/pages/garden/getGardenData'
import { getAttestationsMeta } from '~/server/features/garden/getAttestationsMeta'
import { ps } from '~/server/projects'
import type { Manifest } from '~/utils/Manifest'

export interface HomeCropsProject {
  name: string
  iconUrl: string
}

/**
 * The projects the garden lists, in its editorial order. Empty while the
 * garden is off, so the banner never links to a page that does not exist.
 */
export async function getHomeCropsProjects(
  manifest: Manifest,
): Promise<HomeCropsProject[]> {
  if (!env.CLIENT_SIDE_GARDEN_ENABLED) {
    return []
  }

  const [reviewed, attestation] = await Promise.all([
    ps.getProjects({
      where: ['garden'],
      select: ['garden'],
      optional: ['ossificationHistory'],
    }),
    getAttestationsMeta(),
  ])
  const attested = new Set(attestation.current?.projectIds)
  const now = UnixTime.now()

  return reviewed
    .filter(
      (project) =>
        attested.has(project.id) &&
        project.garden.verdicts[
          measureOssificationBand(project.ossificationHistory, now)
        ].listing === 'listed',
    )
    .sort(compareByCuratedOrder)
    .map((project) => ({
      name: project.name,
      iconUrl: manifest.getUrl(`/icons/${project.slug}.png`),
    }))
}
