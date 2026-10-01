import { ps } from '~/server/projects'
import {
  firstSentence,
  type MarkdownSection,
  withFacts,
} from '../listPageMarkdown'

export async function getPrivacyListSections(): Promise<MarkdownSection[]> {
  const projects = await ps.getProjects({
    select: ['privacyInfo'],
    optional: ['display'],
  })
  return [
    {
      heading: 'Privacy protocols (/privacy/projects/{slug})',
      links: projects.map((p) => ({
        name: p.name,
        path: `/privacy/projects/${p.slug}`,
        description: withFacts(firstSentence(p.display?.description ?? ''), [
          p.privacyInfo.category.label,
          `exit window: ${p.privacyInfo.exitWindow.value}`,
        ]),
      })),
    },
  ]
}
