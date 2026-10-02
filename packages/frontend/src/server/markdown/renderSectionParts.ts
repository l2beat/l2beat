import type { ReferenceLink } from '@l2beat/config'
import { formatSeconds, UnixTime } from '@l2beat/shared-pure'
import type { HostChainRisksWarningProps } from '~/components/HostChainRisksWarning'
import type { ProjectDetailsRelatedProjectBannerProps } from '~/components/ProjectDetailsRelatedProjectBanner'
import type { PastUpgradesData } from '~/components/projects/sections/PastUpgradesDialog'
import type { TechnologyRisk } from '~/components/projects/sections/RiskList'
import {
  hostChainRisksText,
  SECTION_INCOMPLETE_NOTE,
  UNDER_REVIEW_DESCRIPTION,
} from '~/components/projects/sections/sectionCopy'
import type { DiagramParams } from '~/utils/project/getDiagramParams'
import {
  bulletList,
  joinBlocks,
  link,
  markCritical,
  note,
  warning,
} from './markdown'

/*
 * Pieces shared by several section bodies. They live apart from
 * renderProjectSection so the section helpers can use them without importing
 * the module that imports them.
 */

/** The text of the HTML "Under Review" callout. */
export const UNDER_REVIEW_NOTE = `**Under review:** ${UNDER_REVIEW_DESCRIPTION.join(' ')}`

export const INCOMPLETE_NOTE = note(SECTION_INCOMPLETE_NOTE)

/** Only the light variant: the dark one is the same diagram recoloured. */
export function renderDiagram(diagram: DiagramParams | undefined) {
  if (!diagram) return ''
  return `![${diagram.caption}](${diagram.src.light.src})`
}

/** The HTML banner under a section linking the project it depends on. */
export function renderRelatedProjectBanner(
  banner: Pick<ProjectDetailsRelatedProjectBannerProps, 'text' | 'href'> & {
    project: { name: string }
  },
) {
  return `${banner.text} ${link(banner.project.name, banner.href)}`
}

/** Same wording as the HTML banner, which reads as one sentence with the host chain link. */
export function renderHostChainWarning(
  hostChainWarning: HostChainRisksWarningProps | undefined,
) {
  if (!hostChainWarning) return ''
  const { hostChainName, hostChainSlug, riskCount } = hostChainWarning
  return renderRelatedProjectBanner({
    text: hostChainRisksText(riskCount),
    href: `/layer2s/projects/${hostChainSlug}`,
    project: { name: hostChainName },
  })
}

/** UTC and ISO-ordered, so dates sort and parse the same for every reader. */
export function formatUtcDateTime(timestamp: UnixTime) {
  return `${UnixTime.toYYYYMMDDHHMM(timestamp).replace('T', ' ')} UTC`
}

/** The stats the HTML shows above the "View past upgrades" dialog. */
export function formatPastUpgradeStats({
  count,
  lastInterval,
  avgInterval,
}: PastUpgradesData['stats']) {
  return [
    `Count of upgrades: ${count === 0 ? 'No upgrades' : count}`,
    `Last upgrade: ${lastInterval ? `${formatSeconds(lastInterval)} ago` : 'N/A'}`,
    `Avg upgrade interval: ${avgInterval ? formatSeconds(avgInterval) : 'N/A'}`,
  ]
}

/** One row of the "View past upgrades" dialog. */
export function formatPastUpgrade(
  upgrade: PastUpgradesData['upgrades'][number],
) {
  const kind = upgrade.isInitialDeployment ? 'deployment' : 'upgrade'
  const proxy = upgrade.proxyContract
    ? ` of ${link(upgrade.proxyContract.name ?? upgrade.proxyContract.address, upgrade.proxyContract.href)}`
    : ''
  const implementations = upgrade.implementations
    .map((implementation) => {
      const diff = implementation.diffUrl
        ? ` (${link('diff', implementation.diffUrl)})`
        : ''
      return `${link(implementation.address, implementation.href)}${diff}`
    })
    .join(', ')
  return `${formatUtcDateTime(upgrade.timestamp)}, ${kind}${proxy}: transaction ${link(upgrade.transactionHash.hash, upgrade.transactionHash.href)}, implementations: ${implementations}`
}

export function renderRisks(risks: TechnologyRisk[], lead = '**Risks**') {
  if (risks.length === 0) return ''
  return joinBlocks([
    lead,
    bulletList(risks.map((risk) => markCritical(risk.text, risk.isCritical))),
  ])
}

export function renderReferences(references: ReferenceLink[]) {
  if (references.length === 0) return ''
  return joinBlocks(['**References**', renderLinks(references)])
}

export function renderLinks(links: ReferenceLink[]) {
  return bulletList(links.map((entry) => link(entry.title, entry.url)))
}

export function renderWarnings(...texts: (string | undefined)[]) {
  return joinBlocks(texts.flatMap((text) => (text ? [warning(text)] : [])))
}

/** What markdown cannot carry (charts, interactive tables) is pointed at instead; `whatIsShown` starts the sentence, e.g. "The interactive chart is shown". */
export function htmlPagePointer(whatIsShown: string, sectionId: string) {
  return `${whatIsShown} on ${link('the HTML page', `#${sectionId}`)}.`
}
