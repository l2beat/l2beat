import { ps } from '~/server/projects'
import { getProjectPath } from '~/utils/project/getProjectPath'
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
      heading: 'DeFi protocols (/projects/{slug})',
      links: projects.map((p) => ({
        name: p.name,
        path: getProjectPath(p.slug),
        description: withFacts(firstSentence(p.display?.description ?? ''), [
          p.defiInfo.category,
        ]),
      })),
    },
  ]
}
