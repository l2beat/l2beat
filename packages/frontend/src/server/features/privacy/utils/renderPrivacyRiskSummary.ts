import type { PrivacyAdversary, PrivacyRisk } from '@l2beat/config'
import lowerFirst from 'lodash/lowerFirst'
import uniq from 'lodash/uniq'
import { getPrivacyAdversaryBlockId } from '~/pages/privacy/adversaries/privacyAdversaryUi'
import { heading, link, numberedList } from '~/server/markdown/markdown'

/**
 * The risk summary as markdown: one numbered list per category, in the order
 * config gives. An item ends with links to the adversary cells that explain
 * it, in the order config names them.
 */
export function renderPrivacyRiskSummary(
  risks: PrivacyRisk[],
  adversaries: PrivacyAdversary[],
): string {
  return uniq(risks.map((risk) => risk.category))
    .map((category) => {
      const items = risks
        .filter((risk) => risk.category === category)
        .map((risk) => withCells(risk, adversaries))
      // No blank line after the heading: the list sits directly under it.
      return `${heading(2, category)}\n${numberedList(items)}`
    })
    .join('\n<br>\n')
}

/** "… its latest list (see privileged insider)." */
function withCells(risk: PrivacyRisk, adversaries: PrivacyAdversary[]) {
  const cells = (risk.see ?? []).flatMap((id) => {
    const adversary = adversaries.find((adversary) => adversary.id === id)
    if (!adversary) return []
    return [
      link(lowerFirst(adversary.label), `#${getPrivacyAdversaryBlockId(id)}`),
    ]
  })
  if (cells.length === 0) return risk.text
  return `${risk.text.slice(0, -1)} (see ${cells.join(' and ')}).`
}
