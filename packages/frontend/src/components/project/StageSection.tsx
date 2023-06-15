import { StageConfig } from '@l2beat/config'
import React from 'react'

import { ProjectDetailsSection } from './ProjectDetailsSection'

export interface StageSectionProps {
  title: string
  id: string
  stage?: StageConfig | 'UnderReview'
}

export function StageSection({ title, id, stage }: StageSectionProps) {
  if (stage === undefined) {
    return null
  }
  //TODO: implement under review
  if (stage === 'UnderReview') {
    return <span>Under Review 🕵️‍♀️</span>
  }
  return (
    <ProjectDetailsSection title={title} id={id} className="mt-4">
      {stage.summary.map((stage) => (
        <div key={stage.stage} className="mb-4">
          <div className="mb-4 font-bold">{stage.stage}</div>
          <ul className="ml-2 list-none space-y-2">
            {stage.requirements.map((requirement, i) => (
              <li key={i}>
                {requirement.satisfied ? '✅' : '❌'} {requirement.description}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </ProjectDetailsSection>
  )
}
