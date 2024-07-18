import { assertUnreachable } from '@l2beat/shared-pure'
import React from 'react'

import { ContractsSection } from './contracts/contracts-section'
import { MarkdownSection } from './markdown-section'
import { PermissionsSection } from './permissions/permissions-section'
import { RiskAnalysisSection } from './risk-analysis-section'
import { type ProjectDetailsSection } from './types'

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
          case 'MarkdownSection':
            return (
              <MarkdownSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'PermissionsSection':
            return (
              <PermissionsSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          case 'ContractsSection':
            return (
              <ContractsSection
                key={item.props.id}
                sectionOrder={sectionOrder}
                {...item.props}
              />
            )
          default:
            assertUnreachable(item)
        }
      })}
    </div>
  )
}
