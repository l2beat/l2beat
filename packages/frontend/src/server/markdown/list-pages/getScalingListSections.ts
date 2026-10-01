import { ps } from '~/server/projects'
import {
  firstSentence,
  type MarkdownLink,
  type MarkdownSection,
  withFacts,
} from '../listPageMarkdown'

export async function getScalingListSections(): Promise<MarkdownSection[]> {
  const [scaling, ecosystems] = await Promise.all([
    ps.getProjects({
      select: ['scalingInfo'],
      whereNot: ['archivedAt'],
      optional: ['display'],
    }),
    ps.getProjects({ where: ['ecosystemConfig'], optional: ['display'] }),
  ])
  return [
    {
      heading: 'Layer 2s (/layer2s/projects/{slug})',
      links: scaling
        .filter((p) => p.scalingInfo.layer === 'layer2')
        .map(scalingLink),
    },
    {
      heading: 'Layer 3s (/layer2s/projects/{slug})',
      links: scaling
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
