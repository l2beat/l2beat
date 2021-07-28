import { ProjectBridge, ProjectDetails } from '@l2beat/config'
import { config } from '../../../config'
import { TechnologyProps } from '../props'
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
}

export function ProjectDetails({ details, risks, technology, bridges }: Props) {
  return (
    <main className="ProjectDetails">
      <div className="ProjectDetails-LeftColumn">
        <OverviewSection links={details.links} />
        {risks && config.__DEV__showNewDetails && <RiskSection {...risks} />}
        {technology && config.__DEV__showNewDetails ? (
          <>
            <TechnologySection
              title="Technology"
              items={technology.technologies}
            />
            <TechnologySection
              title="Withdrawals"
              items={technology.withdrawals}
            />
            <ReferencesSection items={technology.references} />
          </>
        ) : (
          <ParametersSection details={details} />
        )}
      </div>

      <div className="ProjectDetails-RightColumn">
        {details.notes && <NotesSection notes={details.notes} />}
        <BridgesSection bridges={bridges} />
        {details.news && <NewsSection news={details.news} />}
      </div>
    </main>
  )
}
