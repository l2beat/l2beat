import { ProjectId } from '@l2beat/shared-pure'
import { Meta, Story } from '@storybook/react'
import React, { useEffect } from 'react'

import { configureCharts } from '../../components/chart/configure'
import { ActivityMetaImage } from './ActivityMetaImage'
import { TvlMetaImage } from './TvlMetaImage'

export default {
  title: 'Other/MetaImage',
} as Meta

function Template() {
  useEffect(() => {
    configureCharts()
  })
  const project = {
    display: {
      name: 'Arbitrum One',
      slug: 'arbitrum',
    },
  }

  return (
    <div className="meta flex items-center justify-center">
      <div className="relative h-[314px] min-h-[314px] w-[600px] min-w-[600px] overflow-hidden rounded-lg shadow-2xl">
        <TvlMetaImage
          tvl="$1.34 B"
          sevenDayChange="+3.45%"
          name={project.display.name}
          icon={project.display.slug && `/icons/${project.display.slug}.png`}
          tvlEndpoint="/fakeTvl.json"
        />
      </div>
    </div>
  )
}

export const Project: Story = Template.bind({})
Project.args = {
  projectId: ProjectId('nova'),
}

export const TvlOverview: Story = Template.bind({})

export const ActivityOverview: Story = () => {
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
