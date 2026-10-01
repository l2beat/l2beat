import type { DaBridgeRisks, DaLayerRisks, Project } from '@l2beat/config'
import { shouldHaveNoBridgePage } from '~/server/features/data-availability/utils/shouldHaveNoBridgePage'
import { ps } from '~/server/projects'
import {
  firstSentence,
  type MarkdownLink,
  type MarkdownSection,
  withFacts,
} from '../listPageMarkdown'

export async function getDaListSections(): Promise<MarkdownSection[]> {
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
