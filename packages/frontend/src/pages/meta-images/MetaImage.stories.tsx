import { layer2s } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'
import { Meta, Story } from '@storybook/react'
import React, { useEffect } from 'react'

import { configureCharts } from '../../components/chart/configure'
import { ActivityMetaImage } from './ActivityMetaImage'
import { TvlMetaImage } from './TvlMetaImage'

export default {
  title: 'Other/MetaImage',
  argTypes: {
    projectId: {
      control: 'select',
      options: layer2s.map((x) => x.id),
    },
  },
} as Meta

interface TemplateProps {
  projectId?: ProjectId
}

function Template({ projectId }: TemplateProps) {
  useEffect(() => {
    configureCharts()
  })
  const project = layer2s.find((x) => x.id === projectId)
  return (
    <div className="meta flex items-center justify-center">
      <div className="relative h-[314px] min-h-[314px] w-[600px] min-w-[600px] overflow-hidden rounded-lg shadow-2xl">
        <TvlMetaImage
          tvl="$1.34 B"
          sevenDayChange="+3.45%"
          name={project?.display.name}
          icon={project?.display.slug && `/icons/${project.display.slug}.png`}
          tvlEndpoint="/fakeTvl.json"
        />
      </div>
    </div>
  )
}

export const Project: Story<TemplateProps> = Template.bind({})
Project.args = {
  projectId: ProjectId('nova'),
}

export const TvlOverview: Story<TemplateProps> = Template.bind({})

export const ActivityOverview: Story<TemplateProps> = () => {
  useEffect(() => {
    configureCharts()
  })
  return (
    <div className="meta flex items-center justify-center">
      <div className="relative h-[314px] min-h-[314px] w-[600px] min-w-[600px] overflow-hidden rounded-lg shadow-2xl">
        <ActivityMetaImage
          tpsDaily="15.69"
          tpsWeeklyChange="+3.45%"
          activityEndpoint="/fakeActivity.json"
        />
      </div>
    </div>
  )
}
