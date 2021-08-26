import { ProjectDetails } from '@l2beat/config'
import React from 'react'
import { NewsSection, NewsSectionProps } from '../NewsSection'
import { BridgesSection, BridgesSectionProps } from './BridgesSection'
import { NotesSection } from './NotesSection'
import { OverviewSection, OverviewSectionProps } from './OverviewSection'
import { ParametersSection } from './ParametersSection'

export interface OldProjectDetailsProps {
  details: ProjectDetails
  bridgesSection: BridgesSectionProps
  newsSection?: NewsSectionProps
  overviewSection: OverviewSectionProps
}

export function OldProjectDetails(props: OldProjectDetailsProps) {
  return (
    <main className="OldProjectDetails">
      <div className="OldProjectDetails-LeftColumn">
        <OverviewSection {...props.overviewSection} />
        <ParametersSection details={props.details} />
      </div>

      <div className="OldProjectDetails-RightColumn">
        {props.details.notes && <NotesSection notes={props.details.notes} />}
        <BridgesSection {...props.bridgesSection} />
        {props.newsSection && <NewsSection {...props.newsSection} />}
      </div>
    </main>
  )
}
