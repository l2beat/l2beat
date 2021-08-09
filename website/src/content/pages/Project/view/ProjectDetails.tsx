import { ProjectDetails } from '@l2beat/config'
import { config } from '../../../config'
import { BridgesSection, BridgesSectionProps } from './BridgesSection'
import { NewsSection, NewsSectionProps } from './NewsSection'
import { NotesSection } from './NotesSection'
import { OverviewSection, OverviewSectionProps } from './OverviewSection'
import { ParametersSection } from './ParametersSection'
import { RiskSection, RiskSectionProps } from './RiskSection'
import {
  TechnologyOverview,
  TechnologyOverviewProps,
} from './TechnologyOverview'

export interface ProjectDetailsProps {
  details: ProjectDetails
  riskSection?: RiskSectionProps
  technologyOverview?: TechnologyOverviewProps
  bridgesSection: BridgesSectionProps
  newsSection?: NewsSectionProps
  overviewSection: OverviewSectionProps
}

export function ProjectDetails(props: ProjectDetailsProps) {
  return (
    <main className="ProjectDetails">
      <div className="ProjectDetails-LeftColumn">
        <OverviewSection {...props.overviewSection} />
        {props.riskSection && config.__DEV__showNewDetails && (
          <RiskSection {...props.riskSection} />
        )}
        {props.technologyOverview && config.__DEV__showNewDetails ? (
          <TechnologyOverview {...props.technologyOverview} />
        ) : (
          <ParametersSection details={props.details} />
        )}
      </div>

      <div className="ProjectDetails-RightColumn">
        {props.details.notes && <NotesSection notes={props.details.notes} />}
        <BridgesSection {...props.bridgesSection} />
        {props.newsSection && <NewsSection {...props.newsSection} />}
      </div>
    </main>
  )
}
