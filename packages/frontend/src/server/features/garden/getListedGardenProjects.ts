import type { Project } from '@l2beat/config'
import { measureOssificationBand } from '@l2beat/shared/frontend'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { ps } from '~/server/projects'
import { getAttestationsMeta } from './getAttestationsMeta'

/** Editorial order of the garden table. Reviewed projects not named here follow alphabetically. */
const GARDEN_ORDER: ProjectId[] = [
  ProjectId('tornado-cash'),
  ProjectId('aztecnetworkv6'),
  ProjectId('umbra'),
  ProjectId('uniswapv3'),
]

export type GardenProject = Project<
  'garden',
  | 'scalingInfo'
  | 'privacyInfo'
  | 'defiInfo'
  | 'daLayer'
  | 'ossificationHistory'
  | 'scalingRisks'
  | 'tvsConfig'
>

/**
 * The projects the garden lists, in its editorial order, each with the
 * verdict for its measured ossification.
 */
export async function getListedGardenProjects() {
  const [reviewed, attestation] = await Promise.all([
    ps.getProjects({
      where: ['garden'],
      select: ['garden'],
      optional: [
        'scalingInfo',
        'privacyInfo',
        'defiInfo',
        'daLayer',
        'ossificationHistory',
        'scalingRisks',
        'tvsConfig',
      ],
    }),
    getAttestationsMeta(),
  ])
  // An evaluation shows only once the attester has attested it.
  const attested = new Set(attestation.current?.projectIds)
  const now = UnixTime.now()
  const listed = reviewed
    .filter((project) => attested.has(project.id))
    .map((project) => ({
      project,
      verdict:
        project.garden.verdicts[
          measureOssificationBand(project.ossificationHistory, now)
        ],
    }))
    .filter(({ verdict }) => verdict.listing === 'listed')
    .sort((a, b) => compareByCuratedOrder(a.project, b.project))
  return { listed, attestation: attestation.current }
}

function compareByCuratedOrder(
  a: { id: ProjectId; name: string },
  b: { id: ProjectId; name: string },
): number {
  const aIndex = GARDEN_ORDER.indexOf(a.id)
  const bIndex = GARDEN_ORDER.indexOf(b.id)
  if (aIndex !== -1 && bIndex !== -1) {
    return aIndex - bIndex
  }
  if (aIndex !== -1) return -1
  if (bIndex !== -1) return 1
  return a.name.localeCompare(b.name)
}
