import type { PrivacySource, ProjectPrivacyAdversaries } from '@l2beat/config'
import mapValues from 'lodash/mapValues'
import type { ProjectDetailsSection } from '~/components/projects/sections/types'

/**
 * Turns contract and section sources into url sources pointing at anchors on
 * this page. Section sources are dropped when the page does not render that
 * section, so that no link is dead.
 */
export function resolvePrivacySources(
  adversaries: ProjectPrivacyAdversaries,
  sections: ProjectDetailsSection[],
): ProjectPrivacyAdversaries {
  const titles = new Map(sections.map((s) => [s.props.id, s.props.title]))
  const resolve = (source: PrivacySource): PrivacySource[] => {
    if ('url' in source) return [source]
    if ('contract' in source) {
      const { contract, title = contract } = source
      return [{ title, url: `#${contract}` }]
    }
    const title = source.title ?? titles.get(source.section)
    return title ? [{ title, url: `#${source.section}` }] : []
  }
  return {
    ...adversaries,
    cells: mapValues(adversaries.cells, (cell) => ({
      ...cell,
      sources: cell.sources?.flatMap(resolve),
    })),
  }
}
