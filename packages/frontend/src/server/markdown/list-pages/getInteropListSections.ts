import type { InteropConfig, Project } from '@l2beat/config'
import type { KnownInteropBridgeType } from '@l2beat/shared-pure'
import partition from 'lodash/partition'
import uniq from 'lodash/uniq'
import { ps } from '~/server/projects'
import {
  firstSentence,
  type MarkdownLink,
  type MarkdownSection,
  withFacts,
} from '../listPageMarkdown'

export async function getInteropListSections(): Promise<MarkdownSection[]> {
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
