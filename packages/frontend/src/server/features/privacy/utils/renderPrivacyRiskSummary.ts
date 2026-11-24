import type { PrivacyRisk, PrivacyRiskGroup } from '@l2beat/config'
import { PRIVACY_ADVERSARIES } from '@l2beat/config/build/common/privacyAdversaries'
import lowerFirst from 'lodash/lowerFirst'
import { getPrivacyAdversaryBlockId } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import { heading, link, numberedList } from '~/server/markdown/markdown'

/** The risk summary as markdown: one numbered list per category. */
export function renderPrivacyRiskSummary(groups: PrivacyRiskGroup[]): string {
  return groups
    .map(
      ({ category, risks }) =>
        // No blank line after the heading: the list sits directly under it.
        `${heading(2, category)}\n${numberedList(risks.map(withCells))}`,
    )
    .join('\n<br>\n')
}

/** Ends a risk with links to the adversary cells that explain it: "… its latest list (see privileged insider)." */
function withCells({ text, see = [] }: PrivacyRisk) {
  if (see.length === 0) return text
  const cells = see.map((id) =>
    link(
      lowerFirst(PRIVACY_ADVERSARIES[id].label),
      `#${getPrivacyAdversaryBlockId(id)}`,
    ),
  )
  return `${text.slice(0, -1)} (see ${cells.join(' and ')}).`
}
