import type { ReferenceLink } from '@l2beat/config'
import { formatSeconds, UnixTime } from '@l2beat/shared-pure'
import type { HostChainRisksWarningProps } from '~/components/HostChainRisksWarning'
import type { ProjectDetailsRelatedProjectBannerProps } from '~/components/ProjectDetailsRelatedProjectBanner'
import type { PastUpgradesData } from '~/components/projects/sections/PastUpgradesDialog'
import type { TechnologyRisk } from '~/components/projects/sections/RiskList'
import type { DiagramParams } from '~/utils/project/getDiagramParams'
import { bulletList, joinBlocks, link, markCritical, warning } from './markdown'

/*
 * Pieces shared by several section bodies. They live apart from
 * renderProjectSection so the section helpers can use them without importing
 * the module that imports them.
 */

/** The text of the HTML "Under Review" callout. */
export const UNDER_REVIEW_NOTE =
  '**Under review:** The information in the section might be incomplete or outdated. The L2BEAT Team is working to research & validate the content before publishing.'

export const INCOMPLETE_NOTE =
  '**Note:** This section requires more research and might not present accurate information.'

/** Only the light variant: the dark one is the same diagram recoloured. */
export function renderDiagram(
  diagram: DiagramParams | undefined,
  pageUrl: string,
) {
  if (!diagram) return ''
  return `![${diagram.caption}](${new URL(diagram.src.light.src, pageUrl).href})`
}

/** The HTML banner under a section linking the project it depends on. */
export function renderRelatedProjectBanner(
  banner: Pick<ProjectDetailsRelatedProjectBannerProps, 'text' | 'href'> & {
    project: { name: string }
  },
  pageUrl: string,
) {
  return `${banner.text} ${link(banner.project.name, new URL(banner.href, pageUrl).href)}`
}

/** Same wording as the HTML banner, which reads as one sentence with the host chain link. */
export function renderHostChainWarning(
  hostChainWarning: HostChainRisksWarningProps | undefined,
  pageUrl: string,
) {
  if (!hostChainWarning) return ''
  const { hostChainName, hostChainSlug, riskCount } = hostChainWarning
  return renderRelatedProjectBanner(
    {
      text: riskCount
        ? `There are ${riskCount} additional risks coming from the host chain`
        : 'The section considers only the L3 properties. For more details please refer to',
      href: `/layer2s/projects/${hostChainSlug}`,
      project: { name: hostChainName },
    },
    pageUrl,
  )
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
