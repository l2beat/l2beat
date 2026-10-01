import type { ProjectGovernanceInfo } from '@l2beat/config'
import type { PastUpgradesData } from '~/components/projects/sections/PastUpgradesDialog'
import type { UpgradesAndGovernanceSectionProps } from '~/components/projects/sections/UpgradesAndGovernanceSection'
import {
  bulletList,
  joinBlocks,
  nestHeadings,
  subsection,
  table,
} from './markdown'
import type { SectionContext } from './renderProjectSection'
import {
  formatPastUpgrade,
  formatPastUpgradeStats,
  renderDiagram,
} from './renderSectionParts'

export function renderUpgradesAndGovernance(
  props: Pick<
    UpgradesAndGovernanceSectionProps,
    'diagram' | 'content' | 'governanceInfo' | 'pastUpgrades'
  >,
  level: number,
  context: SectionContext,
) {
  return joinBlocks([
    renderDiagram(props.diagram, context.pageUrl),
    nestHeadings(props.content, level),
    renderGovernanceProfile(props.governanceInfo, level),
    renderPastUpgradesSubsection(props.pastUpgrades, level),
  ])
}

/** Same order and titles as the HTML governance profile tables. */
const GOVERNANCE_PROFILE_TABLES: {
  key: keyof ProjectGovernanceInfo
  title: string
}[] = [
  { key: 'securityCouncil', title: 'Security Council' },
  { key: 'guardians', title: 'Guardians' },
  { key: 'upgrades', title: 'Upgrades' },
  { key: 'tokenGovernance', title: 'Token governance' },
]

function renderGovernanceProfile(
  governanceInfo: ProjectGovernanceInfo | undefined,
  level: number,
) {
  return subsection(
    level,
    'Governance profile',
    joinBlocks(
      GOVERNANCE_PROFILE_TABLES.map(({ key, title }) => {
        const rows = Object.entries(governanceInfo?.[key] ?? {})
        return subsection(
          level + 1,
          title,
          rows.length > 0 ? table(['Property', 'Value'], rows) : '',
        )
      }),
    ),
  )
}

/** The HTML shows the stats and hides the upgrade list behind a "View past upgrades" dialog; here both are spelled out, newest first as in the dialog. */
function renderPastUpgradesSubsection(
  pastUpgrades: PastUpgradesData | undefined,
  level: number,
) {
  if (!pastUpgrades) return ''
  return subsection(
    level,
    'Past upgrades',
    joinBlocks([
      'The metrics include upgrades on the currently used proxy contracts. Historical proxy contracts and changes of such are not included.',
      bulletList(formatPastUpgradeStats(pastUpgrades.stats)),
      bulletList(pastUpgrades.upgrades.map(formatPastUpgrade)),
    ]),
  )
}
