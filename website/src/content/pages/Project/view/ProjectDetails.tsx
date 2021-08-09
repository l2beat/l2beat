import { ProjectBridge, ProjectDetails } from '@l2beat/config'
import { config } from '../../../config'
import { NewsItem } from '../props'
import { BridgesSection } from './BridgesSection'
import { NewsSection } from './NewsSection'
import { NotesSection } from './NotesSection'
import { OverviewSection, OverviewSectionProps } from './OverviewSection'
import { ParametersSection } from './ParametersSection'
import { RiskSection, RiskSectionProps } from './RiskSection'
import { TechnologyOverview, TechnologyOverviewProps } from './TechnologyOverview'

export interface ProjectDetailsProps {
  details: ProjectDetails
  riskSection?: RiskSectionProps
  technology?: TechnologyOverviewProps
  bridges: ProjectBridge[]
  news?: NewsItem[]
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
        {props.technology && config.__DEV__showNewDetails ? (
          <TechnologyOverview {...props.technology} />
        ) : (
          <ParametersSection details={props.details} />
        )}
      </div>

      <div className="ProjectDetails-RightColumn">
        {props.details.notes && <NotesSection notes={props.details.notes} />}
        <BridgesSection bridges={props.bridges} />
        {props.news && <NewsSection news={props.news} />}
      </div>
    </main>
  )
}
