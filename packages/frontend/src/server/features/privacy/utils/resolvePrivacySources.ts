import type { PrivacySource, ProjectPrivacyAdversaries } from '@l2beat/config'
import mapValues from 'lodash/mapValues'
import type {
  ProjectDetailsSection,
  SectionId,
} from '~/components/projects/sections/types'

type PrivacySectionSource = Extract<PrivacySource, { section: string }>

/**
 * Config names the sections a source may point at. Mapping them onto
 * SectionId makes a rename on either side fail the typecheck instead of
 * silently dropping every link to that section.
 */
const SOURCE_SECTION_ID: Record<PrivacySectionSource['section'], SectionId> = {
  permissions: 'permissions',
  verifiers: 'verifiers',
  'trusted-setups': 'trusted-setups',
  'upgrades-and-governance': 'upgrades-and-governance',
}

/**
 * Turns contract and section sources into url sources pointing at anchors on
 * this page. A source is dropped when the page does not render its section
 * or list its contract, so that no link is dead. A chain's page lists only
 * that chain's contracts, while an assessment it shares can cite another's.
 */
export function resolvePrivacySources(
  adversaries: ProjectPrivacyAdversaries,
  sections: ProjectDetailsSection[],
): ProjectPrivacyAdversaries {
  const titles = new Map(sections.map((s) => [s.props.id, s.props.title]))
  const contracts = new Set(
    sections.flatMap((section) =>
      section.type === 'ContractsSection'
        ? Object.values(section.props.contracts)
            .flat()
            .flatMap((c) => [c.id, ...(c.additionalAnchorIds ?? [])])
        : [],
    ),
  )
  const resolve = (source: PrivacySource): PrivacySource[] => {
    if ('url' in source) return [source]
    if ('contract' in source) {
      const { contract, title = contract } = source
      return contracts.has(contract) ? [{ title, url: `#${contract}` }] : []
    }
    const id = SOURCE_SECTION_ID[source.section]
    const sectionTitle = titles.get(id)
    if (sectionTitle === undefined) return []
    return [{ title: source.title ?? sectionTitle, url: `#${id}` }]
  }
  return {
    ...adversaries,
    cells: mapValues(adversaries.cells, (cell) => ({
      ...cell,
      sources: cell.sources?.flatMap(resolve),
    })),
  }
}
