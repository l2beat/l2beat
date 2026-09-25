import express from 'express'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import { env } from '~/env'
import { shouldHaveNoBridgePage } from '~/server/features/data-availability/utils/shouldHaveNoBridgePage'
import type { STATIC_PAGE_PATHS } from '~/server/pagePaths'
import { ps } from '~/server/projects'

/**
 * Markdown versions of the pages that list what L2BEAT tracks, at the page
 * URL plus `.md` as the llms.txt spec recommends. llms.txt links here instead
 * of listing every project itself, so it stays small enough to fit in context
 * while an agent can still map a project name to its page and API slug.
 */
export function createMarkdownAlternatesRouter(
  alternates: MarkdownAlternate[] = MARKDOWN_ALTERNATES,
) {
  const router = express.Router()

  for (const alternate of alternates) {
    router.get(alternate.path, async (_req, res) => {
      res
        .header('Content-Type', 'text/markdown; charset=utf-8')
        .header('Link', `<${PRODUCTION_ORIGIN}/llms.txt>; rel="describedby"`)
        .send(renderMarkdown(alternate, await alternate.getSections()))
    })
  }

  return router
}

export type MarkdownAlternatePath = `${StaticPagePath}.md`

export interface MarkdownAlternate {
  path: MarkdownAlternatePath
  title: string
  summary: string
  getSections: () => Promise<MarkdownSection[]>
}

export interface MarkdownSection {
  heading: string
  links: MarkdownLink[]
}

export type MarkdownLink = { name: string; description: string } & (
  | { path: `/${string}` }
  | { url: string }
)

type StaticPagePath = (typeof STATIC_PAGE_PATHS)[number]

export const MARKDOWN_ALTERNATES: MarkdownAlternate[] = [
  {
    path: '/layer2s/summary.md',
    title: 'L2BEAT scaling projects',
    summary:
      'Every layer 2 and layer 3 tracked by L2BEAT, with category, stage, stack and host chain. Each link is the project page; its last path segment is the {slug} for the public API.',
    getSections: getScalingSections,
  },
  {
    path: '/data-availability/summary.md',
    title: 'L2BEAT data availability layers',
    summary:
      'Every data availability layer tracked by L2BEAT, one entry per bridge to Ethereum plus one for use without a bridge.',
    getSections: getDaSections,
  },
  {
    path: '/zk-catalog.md',
    title: 'L2BEAT ZK catalog',
    summary:
      'Zero-knowledge proving systems used by tracked projects, with their creators.',
    getSections: getZkSections,
  },
  {
    path: '/privacy/summary.md',
    title: 'L2BEAT privacy protocols',
    summary:
      'Privacy protocols on Ethereum and its layer 2s tracked by L2BEAT.',
    getSections: getPrivacySections,
  },
]

export function getMarkdownAlternatePath(
  pagePath: string,
): MarkdownAlternatePath | undefined {
  return MARKDOWN_ALTERNATES.find((a) => a.path === `${pagePath}.md`)?.path
}

async function getScalingSections(): Promise<MarkdownSection[]> {
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

async function getDaSections(): Promise<MarkdownSection[]> {
  const [layers, bridges] = await Promise.all([
    ps.getProjects({
      select: ['daLayer'],
      whereNot: ['archivedAt'],
      optional: ['display'],
    }),
    ps.getProjects({ select: ['daBridge'] }),
  ])
  return [
    {
      heading: 'Layers (/data-availability/projects/{layer}/{bridge})',
      links: layers.flatMap((layer) => {
        const layerBridges = bridges.filter(
          (b) => b.daBridge.daLayer === layer.id,
        )
        const description = withFacts(
          firstSentence(
            layer.display?.description ?? layer.daLayer.description ?? '',
          ),
          [layer.daLayer.type],
        )
        const links: MarkdownLink[] = layerBridges.map((bridge) => ({
          name: `${layer.name} via ${bridge.daBridge.name}`,
          path: `/data-availability/projects/${layer.slug}/${bridge.slug}`,
          description,
        }))
        if (shouldHaveNoBridgePage(layer.daLayer, layerBridges.length)) {
          links.push({
            name: `${layer.name} without a bridge`,
            path: `/data-availability/projects/${layer.slug}/no-bridge`,
            description,
          })
        }
        return links
      }),
    },
  ]
}

async function getZkSections(): Promise<MarkdownSection[]> {
  const projects = await ps.getProjects({
    select: ['zkCatalogInfo'],
    optional: ['display'],
  })
  return [
    {
      heading: 'Proving systems (/zk-catalog/{slug})',
      links: projects.map((p) => ({
        name: p.name,
        path: `/zk-catalog/${p.slug}`,
        description: withFacts(firstSentence(p.display?.description ?? ''), [
          p.zkCatalogInfo.creator && `by ${p.zkCatalogInfo.creator}`,
        ]),
      })),
    },
  ]
}

async function getPrivacySections(): Promise<MarkdownSection[]> {
  const [privacy, defi] = await Promise.all([
    ps.getProjects({ where: ['privacyInfo'], optional: ['display'] }),
    env.CLIENT_SIDE_DEFI_ENABLED
      ? ps.getProjects({ where: ['defiInfo'], optional: ['display'] })
      : Promise.resolve([]),
  ])
  const sections: MarkdownSection[] = [
    {
      heading: 'Privacy protocols (/privacy/projects/{slug})',
      links: privacy.map((p) => ({
        name: p.name,
        path: `/privacy/projects/${p.slug}`,
        description: firstSentence(p.display?.description ?? ''),
      })),
    },
    {
      heading: 'DeFi protocols (/defi/projects/{slug})',
      links: defi.map((p) => ({
        name: p.name,
        path: `/defi/projects/${p.slug}`,
        description: firstSentence(p.display?.description ?? ''),
      })),
    },
  ]
  return sections.filter((section) => section.links.length > 0)
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

/** "Fact, fact, fact. Description." keeps each line scannable and one line long. */
function withFacts(description: string, facts: unknown[]): string {
  const known = facts.filter(
    (fact): fact is string => typeof fact === 'string' && fact !== '',
  )
  return [known.join(', '), description].filter(Boolean).join('. ')
}

function firstSentence(text: string): string {
  const oneLine = text.replaceAll(/\s+/g, ' ').trim()
  const match = oneLine.match(/^.+?[.!?](?=\s|$)/)
  return match?.[0] ?? oneLine
}

/** Same shape as llms.txt (H1, blockquote, H2 link lists) so one parser reads both. */
export function renderMarkdown(
  document: { title: string; summary: string; notes?: string },
  sections: MarkdownSection[],
): string {
  const rendered = sections.map((section) =>
    [
      `## ${section.heading}`,
      '',
      ...section.links.map(
        (link) => `- [${link.name}](${linkUrl(link)}): ${link.description}`,
      ),
    ].join('\n'),
  )

  return `${[
    `# ${document.title}`,
    `> ${document.summary}`,
    document.notes,
    ...rendered,
  ]
    .filter((part) => part !== undefined)
    .join('\n\n')}\n`
}

function linkUrl(link: MarkdownLink) {
  return 'url' in link ? link.url : PRODUCTION_ORIGIN + link.path
}
