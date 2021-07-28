import { ProjectBridge, ProjectDetails } from '@l2beat/config'
import { BridgesSection } from './BridgesSection'
import { NewsSection } from './NewsSection'
import { NotesSection } from './NotesSection'
import { OverviewSection } from './OverviewSection'
import { ParametersSection } from './ParametersSection'

interface Props {
  details: ProjectDetails
  bridges: ProjectBridge[]
}

export function ProjectDetails({ details, bridges }: Props) {
  return (
    <main className="ProjectDetails">
      <div className="ProjectDetails-LeftColumn">
        <OverviewSection links={details.links} />
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
