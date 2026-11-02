import type { ProjectZkCatalogInfo } from '@l2beat/config'
import { pluralize } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'
import uniqBy from 'lodash/uniqBy'
import { ps } from '~/server/projects'
import {
  firstSentence,
  type LinkListSection,
  type MarkdownLink,
  withFacts,
} from '../listPageMarkdown'
import { formatVerifierCounts } from '../zkSectionBodies'

export async function getZkListSections(): Promise<LinkListSection[]> {
  const projects = await ps.getProjects({
    select: ['zkCatalogInfo'],
    optional: ['display', 'archivedAt'],
  })
  const active = projects.filter((p) => !p.archivedAt)
  // Kept for historical reasons: no other markdown index lists them.
  const archived = projects.filter((p) => p.archivedAt)
  return [
    {
      heading: 'Proving systems (/zk-catalog/{slug})',
      links: active.map(zkLink),
    },
    ...(archived.length > 0
      ? [
          {
            heading: 'Archived proving systems (/zk-catalog/{slug})',
            links: archived.map(zkLink),
          },
        ]
      : []),
  ]
}

function zkLink(project: {
  name: string
  slug: string
  zkCatalogInfo: ProjectZkCatalogInfo
  display?: { description: string }
}): MarkdownLink {
  const info = project.zkCatalogInfo
  return {
    name: project.name,
    path: `/zk-catalog/${project.slug}`,
    description: withFacts(firstSentence(project.display?.description ?? ''), [
      info.creator && `by ${info.creator}`,
      info.quantumResistant && 'quantum resistant',
      trustedSetupsFact(info.trustedSetups),
      verifiersFact(info.verifierHashes),
    ]),
  }
}

function trustedSetupsFact(
  setups: ProjectZkCatalogInfo['trustedSetups'],
): string {
  const unique = uniqBy(setups, (setup) => setup.id)
  if (unique.length === 0) return 'no trusted setup'
  return `trusted setups: ${unique.map((s) => `${s.name} (${s.risk})`).join(' / ')}`
}

/** Slashes inside the breakdown: facts are separated by commas. */
function verifiersFact(verifiers: ProjectZkCatalogInfo['verifierHashes']) {
  const total = `${verifiers.length} onchain ${pluralize(verifiers.length, 'verifier')}`
  if (verifiers.length === 0) return total
  const byStatus = mapValues(
    groupBy(verifiers, (v) => v.verificationStatus),
    (group) => ({ count: group.length }),
  )
  return `${total} (${formatVerifierCounts(byStatus, ' / ')})`
}
