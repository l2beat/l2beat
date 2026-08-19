import { ps } from '~/server/projects'
import { manifest } from '~/utils/Manifest'
import { getProjectOssification } from './getProjectOssification'

export interface OssificationEntry {
  slug: string
  name: string
  icon: string
  href: string | undefined
  type: 'Scaling' | 'Privacy' | 'DeFi'
  score: number
  exposure: number | null
  projectAgeSeconds: number | null
  criticalChangesPerYear: number
  clusteredEventCount: number
  contractCount: number
}

/** Every project that opted into the ossification factor, across project
 *  types — the comparison page deliberately spans scaling, privacy, and
 *  DeFi so immutable anchors like Tornado Cash sit next to rollups. */
export async function getOssificationEntries(): Promise<OssificationEntry[]> {
  const projects = await ps.getProjects({
    optional: ['scalingInfo', 'privacyInfo', 'defiInfo'],
    whereNot: ['archivedAt'],
  })

  const entries: OssificationEntry[] = []
  for (const project of projects) {
    const ossification = await getProjectOssification(project.id)
    if (!ossification) continue
    entries.push({
      slug: project.slug,
      name: project.name,
      icon: manifest.getUrl(`/icons/${project.slug}.png`),
      href: project.scalingInfo
        ? `/scaling/projects/${project.slug}#ossification`
        : project.privacyInfo
          ? `/privacy/projects/${project.slug}#ossification`
          : undefined,
      type: project.scalingInfo
        ? 'Scaling'
        : project.privacyInfo
          ? 'Privacy'
          : 'DeFi',
      score: ossification.score,
      exposure: ossification.exposure,
      projectAgeSeconds: ossification.projectAgeSeconds,
      criticalChangesPerYear: ossification.criticalChangesPerYear,
      clusteredEventCount: ossification.clusteredEventCount,
      contractCount: ossification.contracts.length,
    })
  }

  return entries.sort(
    (a, b) => b.score - a.score || (b.exposure ?? 0) - (a.exposure ?? 0),
  )
}
