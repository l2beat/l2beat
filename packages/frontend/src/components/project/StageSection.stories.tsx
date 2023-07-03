import { StageConfig } from '@l2beat/config'
import { Story } from '@storybook/react'
import React, { useEffect } from 'react'

import { configureDropdowns } from '../../scripts/configureDropdowns'
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
function Template(stage: StageConfig) {
  useEffect(() => {
    configureDropdowns()
  }, [])
  return (
    <div className="p-4 leading-normal">
      <StageSectionComponent
        title="Rollup stage"
        id="stage"
        stage={stage}
        icon="/icons/arbitrum.png"
        name="Arbitrum One"
        type="Optimistic Rollup"
      />
    </div>
  )
}

export const StageSection: Story<StageConfig> = Template.bind({})
StageSection.args = item

export const StageSectionUnderReview: Story<StageConfig> = Template.bind({})
StageSectionUnderReview.args = { stage: 'UnderReview' }
