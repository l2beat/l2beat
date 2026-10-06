import {
  DEFI_SUMMARY_CATEGORIES,
  filterDefiSummaryProjects,
} from '~/server/features/defi/defiSummaryVisibility'
import { ps } from '~/server/projects'
import {
  firstSentence,
  type LinkListSection,
  withFacts,
} from '../listPageMarkdown'

export async function getDefiListSections(): Promise<LinkListSection[]> {
  const projects = filterDefiSummaryProjects(
    await ps.getProjects({
      select: ['defiInfo'],
      optional: ['display'],
    }),
    DEFI_SUMMARY_CATEGORIES,
  )
  return [
    {
      heading: 'DeFi protocols (/defi/projects/{slug})',
      links: projects.map((p) => ({
        name: p.name,
        path: `/defi/projects/${p.slug}`,
        description: withFacts(firstSentence(p.display?.description ?? ''), [
          p.defiInfo.category,
        ]),
      })),
    },
  ]
}
