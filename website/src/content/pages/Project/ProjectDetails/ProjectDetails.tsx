import { ProjectBridge, ProjectDetails } from '@l2beat/config'
import { config } from '../../../config'
import { RisksProps } from '../props/getRisks'
import { BridgesSection } from './BridgesSection'
import { NewsSection } from './NewsSection'
import { NotesSection } from './NotesSection'
import { OverviewSection } from './OverviewSection'
import { ParametersSection } from './ParametersSection'
import { RiskSection } from './RiskSection'

interface Props {
  details: ProjectDetails
  risks?: RisksProps
  bridges: ProjectBridge[]
}

export function ProjectDetails({ details, risks, bridges }: Props) {
  return (
    <main className="ProjectDetails">
      <div className="ProjectDetails-LeftColumn">
        <OverviewSection links={details.links} />
        {risks && config.__DEV__showNewDetails && <RiskSection {...risks} />}
        <ParametersSection details={details} />
      </div>

      <div className="ProjectDetails-RightColumn">
        {details.notes && <NotesSection notes={details.notes} />}
        <BridgesSection bridges={bridges} />
        {details.news && <NewsSection news={details.news} />}
      </div>
    </main>
  )
}
