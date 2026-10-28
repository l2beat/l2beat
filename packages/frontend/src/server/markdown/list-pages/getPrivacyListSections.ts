import { ps } from '~/server/projects'
import {
  firstSentence,
  type LinkListSection,
  type MarkdownLink,
  withFacts,
} from '../listPageMarkdown'

export async function getPrivacyListSections(): Promise<LinkListSection[]> {
  const projects = await ps.getProjects({
    select: ['privacyInfo'],
    optional: ['display', 'archivedAt'],
  })
  const active = projects.filter((p) => !p.archivedAt)
  // Privacy has no archived page, so this list is where retired versions stay
  // findable.
  const archived = projects.filter((p) => p.archivedAt)
  return [
    {
      heading: 'Privacy protocols (/privacy/projects/{slug})',
      links: active.map(privacyLink),
    },
    ...(archived.length > 0
      ? [
          {
            heading: 'Archived privacy protocols (/privacy/projects/{slug})',
            links: archived.map(privacyLink),
          },
        ]
      : []),
  ]
}

function privacyLink(project: {
  name: string
  slug: string
  privacyInfo: {
    category: { label: string }
    exitWindow: { value: string }
  }
  display?: { description: string }
}): MarkdownLink {
  return {
    name: project.name,
    path: `/privacy/projects/${project.slug}`,
    description: withFacts(firstSentence(project.display?.description ?? ''), [
      project.privacyInfo.category.label,
      `exit window: ${project.privacyInfo.exitWindow.value}`,
    ]),
  }
}
