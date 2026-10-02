import { ps } from '~/server/projects'
import {
  firstSentence,
  type LinkListSection,
  withFacts,
} from '../listPageMarkdown'

export async function getDefiListSections(): Promise<LinkListSection[]> {
  const projects = await ps.getProjects({
    select: ['defiInfo'],
    optional: ['display'],
  })
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
