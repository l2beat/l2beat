import { ProjectBridge, ProjectDetails } from '@l2beat/config'
import { config } from '../../../config'
import { NewsItem, TechnologyProps } from '../props'
import { RiskProps } from '../props/getRiskProps'
import { BridgesSection } from './BridgesSection'
import { NewsSection } from './NewsSection'
import { NotesSection } from './NotesSection'
import { OverviewSection } from './OverviewSection'
import { ParametersSection } from './ParametersSection'
import { ReferencesSection } from './ReferencesSection'
import { RiskSection } from './RiskSection'
import { TechnologySection } from './TechnologySection'

interface Props {
  details: ProjectDetails
  risks?: RiskProps
  technology?: TechnologyProps
  bridges: ProjectBridge[]
  news?: NewsItem[]
}

export function ProjectDetails(props: Props) {
  return (
    <main className="ProjectDetails">
      <div className="ProjectDetails-LeftColumn">
        <OverviewSection links={props.details.links} />
        {props.risks && config.__DEV__showNewDetails && (
          <RiskSection {...props.risks} />
        )}
        {props.technology && config.__DEV__showNewDetails ? (
          <>
            <TechnologySection
              title="Technology"
              items={props.technology.technologies}
            />
            <TechnologySection
              title="Withdrawals"
              items={props.technology.withdrawals}
            />
            <ReferencesSection items={props.technology.references} />
          </>
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
