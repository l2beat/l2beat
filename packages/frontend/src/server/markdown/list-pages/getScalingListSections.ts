import { ps } from '~/server/projects'
import { getProjectPath } from '~/utils/project/getProjectPath'
import {
  firstSentence,
  type LinkListSection,
  type MarkdownLink,
  withFacts,
} from '../listPageMarkdown'

export async function getScalingListSections(): Promise<LinkListSection[]> {
  const scaling = await ps.getProjects({
    select: ['scalingInfo'],
    optional: ['display', 'archivedAt'],
  })
  const active = scaling.filter((p) => !p.archivedAt)
  // Kept for historical reasons: no other markdown index lists them.
  const archived = scaling.filter((p) => p.archivedAt)
  const archivedSections = [
    {
      heading: 'Archived Layer 2s (/projects/{slug})',
      links: archived
        .filter((p) => p.scalingInfo.layer === 'layer2')
        .map(scalingLink),
    },
    {
      heading: 'Archived Layer 3s (/projects/{slug})',
      links: archived
        .filter((p) => p.scalingInfo.layer === 'layer3')
        .map(scalingLink),
    },
  ].filter((section) => section.links.length > 0)
  return [
    {
      heading: 'Layer 2s (/projects/{slug})',
      links: active
        .filter((p) => p.scalingInfo.layer === 'layer2')
        .map(scalingLink),
    },
    {
      heading: 'Layer 3s (/projects/{slug})',
      links: active
        .filter((p) => p.scalingInfo.layer === 'layer3')
        .map(scalingLink),
    },
    ...archivedSections,
  ]
}

function scalingLink(project: {
  name: string
  slug: string
  scalingInfo: {
    type: string | undefined
    stage: string
    hostChain: { name: string }
    stacks: string[] | undefined
  }
  display?: { description: string }
}): MarkdownLink {
  const info = project.scalingInfo
  return {
    name: project.name,
    path: getProjectPath(project.slug),
    description: withFacts(firstSentence(project.display?.description ?? ''), [
      info.type ?? 'Other',
      info.stage !== 'Not applicable' && info.stage,
      info.stacks?.join(', '),
      `on ${info.hostChain.name}`,
    ]),
  }
}
