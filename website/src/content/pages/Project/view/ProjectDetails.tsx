import { ProjectDetails } from '@l2beat/config'
import { config } from '../../../config'
import { NewsSection, NewsSectionProps } from './NewsSection'
import { BridgesSection, BridgesSectionProps } from './old/BridgesSection'
import { NotesSection } from './old/NotesSection'
import { OldProjectDetails } from './old/OldProjectDetails'
import { OverviewSection, OverviewSectionProps } from './old/OverviewSection'
import { ParametersSection } from './old/ParametersSection'
import { RiskSection, RiskSectionProps } from './RiskSection'
import {
  TechnologyOverview,
  TechnologyOverviewProps,
} from './TechnologyOverview'

export interface ProjectDetailsProps {
  details: ProjectDetails
  riskSection: RiskSectionProps
  technologyOverview: TechnologyOverviewProps
  bridgesSection: BridgesSectionProps
  newsSection?: NewsSectionProps
  overviewSection: OverviewSectionProps
}

export function ProjectDetails(props: ProjectDetailsProps) {
  if (!config.__DEV__showNewDetails) {
    return <OldProjectDetails {...props} />
  }
  return (
    <main className="OldProjectDetails">
      <div className="OldProjectDetails-LeftColumn">
        <OverviewSection {...props.overviewSection} />
        <RiskSection {...props.riskSection} />
        <TechnologyOverview {...props.technologyOverview} />
      </div>

      <div className="OldProjectDetails-RightColumn">
        {props.newsSection && <NewsSection {...props.newsSection} />}
      </div>
    </main>
  )
}
