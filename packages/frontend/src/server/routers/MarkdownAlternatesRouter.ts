import type {
  DaBridgeRisks,
  DaLayerRisks,
  InteropConfig,
  Project,
  ProjectZkCatalogInfo,
} from '@l2beat/config'
import { type KnownInteropBridgeType, pluralize } from '@l2beat/shared-pure'
import express from 'express'
import partition from 'lodash/partition'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import { externalLinks } from '~/consts/externalLinks'
import { PRODUCTION_ORIGIN } from '~/consts/productionOrigin'
import { env } from '~/env'
import { shouldHaveNoBridgePage } from '~/server/features/data-availability/utils/shouldHaveNoBridgePage'
import { sendMarkdownDocument } from '~/server/markdown/markdownAlternate'
import { ps } from '~/server/projects'
import type { ListPageWithMarkdown } from '~/utils/getMarkdownAlternatePath'

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
      sendMarkdownDocument(
        res,
        renderMarkdown(alternate, await alternate.getSections()),
      )
    })
  }

  return router
}

export type MarkdownAlternatePath = `${ListPageWithMarkdown}.md`

export interface MarkdownAlternate {
  path: MarkdownAlternatePath
  title: string
  summary: string
  /** The intro the HTML page shows above its table. */
  notes?: string
  getSections: () => Promise<MarkdownSection[]>
}

export interface MarkdownSection {
  heading: string
  description?: string
  links: MarkdownLink[]
}

export type MarkdownLink = { name: string; description: string } & (
  | { path: `/${string}` }
  | { url: string }
)

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
      'Every data availability layer tracked by L2BEAT with its type and risks: public layers one entry per bridge to Ethereum plus one for use without a bridge, and custom solutions built for a single project.',
    getSections: getDaSections,
  },
  {
    path: '/zk-catalog.md',
    title: 'L2BEAT ZK catalog',
    summary:
      'Zero-knowledge proving systems used by tracked projects, with their creators, trusted setups and onchain verifiers.',
    notes: [
      'ZK Catalog by L2BEAT is a community-driven resource offering detailed insights into the ZK technology utilized by various blockchain projects. It aims to enhance transparency and understanding of ZK tech implementations across the industry.',
      '',
      `Trusted setup risks (green, yellow, red) follow the [Trusted Setups Risk Framework](${externalLinks.articles.trustedSetupFramework}).`,
    ].join('\n'),
    getSections: getZkSections,
  },
  {
    path: '/privacy/summary.md',
    title: 'L2BEAT privacy protocols',
    summary:
      'Privacy protocols on Ethereum and its layer 2s tracked by L2BEAT, with their category and exit window.',
    notes:
      'Analysis of privacy protocols on Ethereum focusing on CROPS principles (Censorship Resistance, Openness, Privacy, Security).',
    getSections: getPrivacySections,
  },
  {
    path: '/interop/summary.md',
    title: 'L2BEAT interoperability protocols',
    summary:
      'Cross-chain protocols tracked by L2BEAT, with their type and the bridge types they use.',
    notes:
      'Token pages live at /interop/tokens/{id}/{issuer}/{symbol}, where {id} is case-sensitive and alone identifies the token. Token ids come from the database, so they are not listed here: take them from the token links on the protocol pages.',
    getSections: getInteropSections,
  },
  // Behind the same flag as the page: listed while off, this would be a 404.
  ...(env.CLIENT_SIDE_DEFI_ENABLED
    ? [
        {
          path: '/defi/summary.md',
          title: 'L2BEAT DeFi protocols',
          summary: 'DeFi protocols tracked by L2BEAT, with their category.',
          notes: 'Overview of DeFi protocols tracked by L2BEAT.',
          getSections: getDefiSections,
        } satisfies MarkdownAlternate,
      ]
    : []),
]

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
  const [layers, bridges, customSolutions] = await Promise.all([
    ps.getProjects({
      select: ['daLayer'],
      whereNot: ['archivedAt'],
      optional: ['display'],
    }),
    ps.getProjects({ select: ['daBridge'] }),
    ps.getProjects({
      select: ['customDa'],
      whereNot: ['archivedAt'],
      optional: ['display'],
    }),
  ])
  const daLayerLinks = (systemCategory: 'public' | 'custom') =>
    layers
      .filter((layer) => layer.daLayer.systemCategory === systemCategory)
      .flatMap((layer) =>
        daLayerLinksPerBridge(
          layer,
          bridges.filter((b) => b.daBridge.daLayer === layer.id),
        ),
      )
  return [
    {
      heading: 'Public layers (/data-availability/projects/{layer}/{bridge})',
      description:
        'Public DA layers are data availability solutions designed for broad, general use across multiple scaling projects.',
      links: daLayerLinks('public'),
    },
    {
      heading: 'Custom solutions (/layer2s/projects/{slug})',
      description:
        'Custom DA layers are data availability solutions tightly integrated with a single scaling project, so each links to the page of the project it serves.',
      links: [...daLayerLinks('custom'), ...customSolutions.map(customDaLink)],
    },
  ]
}

function daLayerLinksPerBridge(
  layer: Project<'daLayer', 'display'>,
  layerBridges: Project<'daBridge'>[],
): MarkdownLink[] {
  const layerDescription = firstSentence(
    layer.display?.description ?? layer.daLayer.description ?? '',
  )
  const layerFacts = [layer.daLayer.type, ...riskFacts(layer.daLayer.risks)]
  const links: MarkdownLink[] = layerBridges.map((bridge) => ({
    name: `${layer.name} via ${bridge.daBridge.name}`,
    path: `/data-availability/projects/${layer.slug}/${bridge.slug}`,
    description: withFacts(layerDescription, [
      ...layerFacts,
      ...riskFacts(bridge.daBridge.risks),
    ]),
  }))
  if (shouldHaveNoBridgePage(layer.daLayer, layerBridges.length)) {
    links.push({
      name: `${layer.name} without a bridge`,
      path: `/data-availability/projects/${layer.slug}/no-bridge`,
      description: withFacts(layerDescription, layerFacts),
    })
  }
  return links
}

function customDaLink(project: Project<'customDa', 'display'>): MarkdownLink {
  const { customDa } = project
  return {
    name: customDa.name ?? `${project.name} DAC`,
    path: `/layer2s/projects/${project.slug}`,
    description: withFacts(
      firstSentence(customDa.description ?? project.display?.description ?? ''),
      [
        customDa.type,
        `used by ${project.name}`,
        customDa.fallback && `fallback: ${customDa.fallback.value}`,
        ...riskFacts(customDa.risks),
      ],
    ),
  }
}

/** Config values only: economic security the HTML adjusts by TVS is shown unadjusted. */
function riskFacts(risks: DaLayerRisks & DaBridgeRisks): string[] {
  return [
    ['DA layer', risks.daLayer?.value],
    ['economic security', risks.economicSecurity?.value.value],
    ['fraud detection', risks.fraudDetection?.value],
    ['DA bridge', risks.daBridge?.value],
    ['committee security', risks.committeeSecurity?.value],
    ['upgradeability', risks.upgradeability?.value],
    ['relayer failure', risks.relayerFailure?.value],
  ].flatMap(([name, value]) => (value ? [`${name}: ${value}`] : []))
}

async function getZkSections(): Promise<MarkdownSection[]> {
  const projects = await ps.getProjects({
    select: ['zkCatalogInfo'],
    whereNot: ['archivedAt'],
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
          p.zkCatalogInfo.quantumResistant && 'quantum resistant',
          trustedSetupsFact(p.zkCatalogInfo.trustedSetups),
          verifiersFact(p.zkCatalogInfo.verifierHashes),
        ]),
      })),
    },
  ]
}

function trustedSetupsFact(
  setups: ProjectZkCatalogInfo['trustedSetups'],
): string {
  const unique = uniqBy(setups, (setup) => setup.id)
  if (unique.length === 0) return 'no trusted setup'
  return `trusted setups: ${unique.map((s) => `${s.name} (${s.risk})`).join(' / ')}`
}

function verifiersFact(verifiers: ProjectZkCatalogInfo['verifierHashes']) {
  const count = (status: string) =>
    verifiers.filter((v) => v.verificationStatus === status).length
  const statuses = [
    [count('successful'), 'independently regenerated'],
    [count('unsuccessful'), 'failed regeneration'],
    [count('notVerified'), 'not verified'],
  ] as const
  const breakdown = statuses
    .filter(([n]) => n > 0)
    .map(([n, label]) => `${n} ${label}`)
    .join(' / ')
  return `${verifiers.length} onchain ${pluralize(verifiers.length, 'verifier')}${breakdown && ` (${breakdown})`}`
}

async function getPrivacySections(): Promise<MarkdownSection[]> {
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

async function getInteropSections(): Promise<MarkdownSection[]> {
  const projects = await ps.getProjects({
    select: ['interopConfig'],
    optional: ['display', 'scalingInfo'],
  })
  const [scalingBridges, protocols] = partition(
    projects,
    (p) => p.scalingInfo !== undefined,
  )
  return [
    {
      heading: 'Protocols (/interop/protocols/{slug})',
      links: protocols.map((p) =>
        interopLink(p, `/interop/protocols/${p.slug}`),
      ),
    },
    {
      heading:
        'Canonical bridges of scaling projects (/layer2s/projects/{slug})',
      description:
        'Their interop data is on the scaling project page: /interop/protocols/{slug} redirects there.',
      links: scalingBridges.map((p) =>
        interopLink(p, `/layer2s/projects/${p.slug}`),
      ),
    },
  ]
}

function interopLink(
  project: Project<'interopConfig', 'display'>,
  path: `/${string}`,
): MarkdownLink {
  const config = project.interopConfig
  const bridgeTypes = uniq(
    config.plugins.map((plugin) => BRIDGE_TYPE_LABELS[plugin.bridgeType]),
  )
  return {
    name: config.name ?? project.name,
    path,
    description: withFacts(
      firstSentence(config.description ?? project.display?.description ?? ''),
      [INTEROP_TYPE_LABELS[config.type], bridgeTypes.join(' / ')],
    ),
  }
}

const INTEROP_TYPE_LABELS: Record<InteropConfig['type'], string> = {
  multichain: 'Multichain',
  intent: 'Intent bridge',
  canonical: 'Canonical bridge',
  other: 'Other',
}

/** Named as the interop pages that list each bridge type. */
const BRIDGE_TYPE_LABELS: Record<KnownInteropBridgeType, string> = {
  nonMinting: 'non-minting',
  lockAndMint: 'lock-and-mint',
  burnAndMint: 'burn-and-mint',
}

async function getDefiSections(): Promise<MarkdownSection[]> {
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
      ...(section.description ? [section.description, ''] : []),
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
