import type { ProjectZkCatalogInfo } from '@l2beat/config'
import { pluralize } from '@l2beat/shared-pure'
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'
import uniqBy from 'lodash/uniqBy'
import { ps } from '~/server/projects'
import {
  firstSentence,
  type LinkListSection,
  withFacts,
} from '../listPageMarkdown'
import { formatVerifierCounts } from '../zkSectionBodies'

export async function getZkListSections(): Promise<LinkListSection[]> {
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
