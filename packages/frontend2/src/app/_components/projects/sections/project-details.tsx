import { assertUnreachable } from '@l2beat/shared-pure'
import React from 'react'

import { type ProjectDetailsSection } from './types'
import { RiskAnalysisSection } from './risk-analysis-section'

export interface ProjectDetailsProps {
  items: ProjectDetailsSection[]
  isUpcoming?: boolean
}

export function ProjectDetails(props: ProjectDetailsProps) {
  return (
    <div className="px-4 md:px-0">
      {props.items.map((item, index) => {
        const sectionOrder = index + 1

        switch (item.type) {
          case 'RiskAnalysisSection':
            return (
              <RiskAnalysisSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'RiskAnalysisSection2':
            return (
              <RiskAnalysisSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
                title="Risk analysis 2"
              />
            )
          default:
            assertUnreachable(item)
        }
      })}
    </div>
  )
}
