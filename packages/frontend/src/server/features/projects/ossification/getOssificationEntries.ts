import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getProjectOssification } from './getProjectOssification'

export interface OssificationEntry {
  slug: string
  name: string
  icon: string
  href: string | undefined
  score: number
  exposure: number | null
  projectAgeSeconds: number | null
  criticalChangesPerYear: number
  clusteredEventCount: number
  contractCount: number
}

/** Every project that opted into the ossification factor. The comparison
 *  deliberately spans all project types tracked by L2BEAT. */
export async function getOssificationEntries(): Promise<OssificationEntry[]> {
  const projects = await ps.getProjects({
    optional: ['scalingInfo', 'privacyInfo', 'defiInfo'],
    whereNot: ['archivedAt'],
  })

  const entries = await Promise.all(
    projects.map(async (project): Promise<OssificationEntry | undefined> => {
      const ossification = await getProjectOssification(project.id)
      if (!ossification) return undefined

      return {
        slug: project.slug,
        name: project.name,
        icon: manifest.getUrl(`/icons/${project.slug}.png`),
        href: project.scalingInfo
          ? `/layer2s/projects/${project.slug}#ossification`
          : project.privacyInfo
            ? `/privacy/projects/${project.slug}#ossification`
            : project.defiInfo
              ? `/defi/projects/${project.slug}#ossification`
              : undefined,
        score: ossification.score,
        exposure: ossification.exposure,
        projectAgeSeconds: ossification.projectAgeSeconds,
        criticalChangesPerYear: ossification.criticalChangesPerYear,
        clusteredEventCount: ossification.clusteredEventCount,
        contractCount: ossification.contracts.length,
      }
    }),
  )

  return entries
    .filter((entry): entry is OssificationEntry => entry !== undefined)
    .sort((a, b) => b.score - a.score || (b.exposure ?? 0) - (a.exposure ?? 0))
}
