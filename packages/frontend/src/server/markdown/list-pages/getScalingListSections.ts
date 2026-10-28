import { ps } from '~/server/projects'
import {
  firstSentence,
  type LinkListSection,
  type MarkdownLink,
  withFacts,
} from '../listPageMarkdown'

export async function getScalingListSections(): Promise<LinkListSection[]> {
  const [scaling, ecosystems] = await Promise.all([
    ps.getProjects({
      select: ['scalingInfo'],
      optional: ['display', 'archivedAt'],
    }),
    ps.getProjects({ where: ['ecosystemConfig'], optional: ['display'] }),
  ])
  const active = scaling.filter((p) => !p.archivedAt)
  // Kept for historical reasons: no other markdown index lists them.
  const archived = scaling.filter((p) => p.archivedAt)
  const archivedSections = [
    {
      heading: 'Archived Layer 2s (/layer2s/projects/{slug})',
      links: archived
        .filter((p) => p.scalingInfo.layer === 'layer2')
        .map(scalingLink),
    },
    {
      heading: 'Archived Layer 3s (/layer2s/projects/{slug})',
      links: archived
        .filter((p) => p.scalingInfo.layer === 'layer3')
        .map(scalingLink),
    },
  ].filter((section) => section.links.length > 0)
  return [
    {
      heading: 'Layer 2s (/layer2s/projects/{slug})',
      links: active
        .filter((p) => p.scalingInfo.layer === 'layer2')
        .map(scalingLink),
    },
    {
      heading: 'Layer 3s (/layer2s/projects/{slug})',
      links: active
        .filter((p) => p.scalingInfo.layer === 'layer3')
        .map(scalingLink),
    },
    {
      heading: 'Ecosystems (/ecosystems/{slug})',
      links: ecosystems.map((p) => ({
        name: p.name,
        path: `/ecosystems/${p.slug}`,
        description: firstSentence(p.display?.description ?? ''),
      })),
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
    path: `/layer2s/projects/${project.slug}`,
    description: withFacts(firstSentence(project.display?.description ?? ''), [
      info.type ?? 'Other',
      info.stage !== 'Not applicable' && info.stage,
      info.stacks?.join(', '),
      `on ${info.hostChain.name}`,
    ]),
  }
}
