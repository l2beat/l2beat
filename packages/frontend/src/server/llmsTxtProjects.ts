import { env } from '~/env'
import { shouldHaveNoBridgePage } from './features/data-availability/utils/shouldHaveNoBridgePage'
import { ps } from './projects'

export interface LlmsTxtSection {
  heading: string
  links: LlmsTxtLink[]
}

export type LlmsTxtLink = { name: string; description: string } & (
  | { path: `/${string}` }
  | { url: string }
)

/**
 * One section per tracker, one line per tracked project, so an agent can go
 * from a project name to its page (and API slug) without scraping the tables.
 * Read from the config database, so the lists match what the site serves.
 */
export async function getProjectSections(): Promise<LlmsTxtSection[]> {
  const [scaling, daLayers, daBridges, zk, ecosystems, privacy, defi] =
    await Promise.all([
      ps.getProjects({
        select: ['scalingInfo'],
        whereNot: ['archivedAt'],
        optional: ['display'],
      }),
      ps.getProjects({
        select: ['daLayer'],
        whereNot: ['archivedAt'],
        optional: ['display'],
      }),
      ps.getProjects({ select: ['daBridge'] }),
      ps.getProjects({ select: ['zkCatalogInfo'], optional: ['display'] }),
      ps.getProjects({ where: ['ecosystemConfig'], optional: ['display'] }),
      ps.getProjects({ where: ['privacyInfo'], optional: ['display'] }),
      env.CLIENT_SIDE_DEFI_ENABLED
        ? ps.getProjects({ where: ['defiInfo'], optional: ['display'] })
        : Promise.resolve([]),
    ])

  const layer2s = scaling.filter((p) => p.scalingInfo.layer === 'layer2')
  const layer3s = scaling.filter((p) => p.scalingInfo.layer === 'layer3')

  const sections: LlmsTxtSection[] = [
    {
      heading: 'Layer 2 projects (/layer2s/projects/{slug})',
      links: layer2s.map(scalingLink),
    },
    {
      heading: 'Layer 3 projects (/layer2s/projects/{slug})',
      links: layer3s.map(scalingLink),
    },
    {
      heading:
        'Data availability layers (/data-availability/projects/{layer}/{bridge})',
      links: daLayers.flatMap((layer) => {
        const bridges = daBridges.filter((b) => b.daBridge.daLayer === layer.id)
        const description = firstSentence(
          layer.display?.description ?? layer.daLayer.description ?? '',
        )
        const links: LlmsTxtLink[] = bridges.map((bridge) => ({
          name: `${layer.name} via ${bridge.daBridge.name}`,
          path: `/data-availability/projects/${layer.slug}/${bridge.slug}`,
          description: withFacts(description, [layer.daLayer.type]),
        }))
        if (shouldHaveNoBridgePage(layer.daLayer, bridges.length)) {
          links.push({
            name: `${layer.name} without a bridge`,
            path: `/data-availability/projects/${layer.slug}/no-bridge`,
            description: withFacts(description, [layer.daLayer.type]),
          })
        }
        return links
      }),
    },
    {
      heading: 'ZK catalog (/zk-catalog/{slug})',
      links: zk.map((p) => ({
        name: p.name,
        path: `/zk-catalog/${p.slug}`,
        description: withFacts(firstSentence(p.display?.description ?? ''), [
          p.zkCatalogInfo.creator && `by ${p.zkCatalogInfo.creator}`,
        ]),
      })),
    },
    {
      heading: 'Ecosystems (/ecosystems/{slug})',
      links: ecosystems.map((p) => ({
        name: p.name,
        path: `/ecosystems/${p.slug}`,
        description: firstSentence(p.display?.description ?? ''),
      })),
    },
    {
      heading: 'Privacy protocols (/privacy/projects/{slug})',
      links: privacy.map((p) => ({
        name: p.name,
        path: `/privacy/projects/${p.slug}`,
        description: firstSentence(p.display?.description ?? ''),
      })),
    },
  ]

  if (defi.length > 0) {
    sections.push({
      heading: 'DeFi protocols (/defi/projects/{slug})',
      links: defi.map((p) => ({
        name: p.name,
        path: `/defi/projects/${p.slug}`,
        description: firstSentence(p.display?.description ?? ''),
      })),
    })
  }

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
}): LlmsTxtLink {
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
