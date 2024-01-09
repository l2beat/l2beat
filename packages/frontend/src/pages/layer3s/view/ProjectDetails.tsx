import { assertUnreachable } from '@l2beat/shared-pure'
import React from 'react'

import { DetailedDescriptionSection } from '../../../components/project/DetailedDescriptionSection'
import { KnowledgeNuggetsSection } from '../../../components/project/KnowledgeNuggetsSection'
import { MilestonesSection } from '../../../components/project/MilestonesSection'
import { TechnologyIncompleteProps } from '../../../components/project/TechnologyIncomplete'
import { UpcomingDisclaimer } from '../../../components/project/UpcomingDisclaimer'
import { WrongResearchCTA } from '../../../components/project/WrongInformationCTA'
import { ScalingDetailsItem } from '../props/getProjectDetails'

export interface ProjectDetailsProps {
  items: ScalingDetailsItem[]
  issueLink: string
  editLink: string
  isUpcoming?: boolean
  incomplete?: TechnologyIncompleteProps
}

export function ProjectDetails(props: ProjectDetailsProps) {
  return (
    <div className="px-4 md:px-0">
      {props.items.map((item, index) => {
        switch (item.type) {
          case 'MilestonesSection':
            return <MilestonesSection key={item.props.id} {...item.props} />
          case 'KnowledgeNuggetsSection':
            return (
              <KnowledgeNuggetsSection key={item.props.id} {...item.props} />
            )
          case 'DetailedDescriptionSection':
            return (
              <DetailedDescriptionSection key={item.props.id} {...item.props} />
            )
          case 'UpcomingDisclaimer':
            return (
              <UpcomingDisclaimer
                key={`${item.type}${index}`}
                className="mt-6"
              />
            )
          default:
            assertUnreachable(item)
        }
      })}
      <WrongResearchCTA issueLink={props.issueLink} editLink={props.editLink} />
    </div>
  )
}
