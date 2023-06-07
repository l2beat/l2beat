import { StageConfig } from '@l2beat/config'
import React from 'react'

import { StageSection as StageSectionComponent } from './StageSection'

export default {
  title: 'Components/Project/StageSection',
}

const item: StageConfig = {
  stage: 'Stage 1',
  missing: {
    nextStage: 'Stage 2',
    requirements: ['C requirement'],
  },
  summary: [
    {
      stage: 'Stage 0',
      requirements: [
        {
          satisfied: true,
          description: 'A requirement',
        },
        {
          satisfied: true,
          description: 'AA requirement',
        },
      ],
    },
    {
      stage: 'Stage 1',
      requirements: [
        {
          satisfied: true,
          description: 'B requirement',
        },
        {
          satisfied: true,
          description: 'BB requirement',
        },
      ],
    },
    {
      stage: 'Stage 2',
      requirements: [
        {
          satisfied: false,
          description: 'C requirement',
        },
      ],
    },
  ],
}

export function StageSection() {
  return (
    <div className="p-4 leading-normal">
      <StageSectionComponent title="Stage" id="stage" stage={item} />
    </div>
  )
}
