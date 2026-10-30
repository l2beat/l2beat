import type { ProjectGovernanceInfo, ProjectUpgradePath } from '@l2beat/config'
import { GOVERNANCE_INFO_SECTIONS } from '~/components/projects/sections/governanceInfoSections'
import type { PastUpgradesData } from '~/components/projects/sections/PastUpgradesDialog'
import { PAST_UPGRADES_DESCRIPTION } from '~/components/projects/sections/sectionCopy'
import type { UpgradesAndGovernanceSectionProps } from '~/components/projects/sections/UpgradesAndGovernanceSection'
import { configMarkdown } from './configMarkdown'
import { bulletList, joinBlocks, subsection, table } from './markdown'
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
) {
  return joinBlocks([
    renderDiagram(props.diagram),
    configMarkdown(props.content, level),
    renderGovernanceProfile(props.governanceInfo, level),
    renderPastUpgradesSubsection(props.pastUpgrades, level),
  ])
}

function renderGovernanceProfile(
  governanceInfo: ProjectGovernanceInfo | undefined,
  level: number,
) {
  return subsection(
    level,
    'Governance profile',
    joinBlocks(
      GOVERNANCE_INFO_SECTIONS.map(({ key, title }) => {
        const rows = Object.entries(governanceInfo?.[key] ?? {}).map(
          ([name, value]): [string, string] => [
            name,
            typeof value === 'string' ? value : formatUpgradePath(value),
          ],
        )
        return subsection(
          level + 1,
          title,
          rows.length > 0 ? table(['Property', 'Value'], rows) : '',
        )
      }),
    ),
  )
}

/** The HTML draws the path as a timeline; a table cell gets it as one line. */
function formatUpgradePath(path: ProjectUpgradePath) {
  const steps = path.steps.map((step) => step.description).join(' → ')
  return path.note ? `${steps}. ${path.note}` : `${steps}.`
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
      PAST_UPGRADES_DESCRIPTION,
      bulletList(formatPastUpgradeStats(pastUpgrades.stats)),
      bulletList(pastUpgrades.upgrades.map(formatPastUpgrade)),
    ]),
  )
}
