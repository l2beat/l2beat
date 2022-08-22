import '../styles/meta-image.scss'

import { projects } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'
import { Meta, Story } from '@storybook/react'
import React, { useEffect } from 'react'

import { MetaImage } from '../pages/MetaImages/MetaImage'
import { configureChart } from '../scripts/chart'

export default {
  title: 'Components/MetaImage',
  argTypes: {
    projectId: {
      control: 'select',
      options: projects.map((x) => x.id),
    },
  },
} as Meta

interface TemplateProps {
  projectId?: ProjectId
}

function Template({ projectId }: TemplateProps) {
  useEffect(() => {
    configureChart()
  })
  const project = projects.find((x) => x.id === projectId)
  return (
    <div className="flex items-center justify-center">
      <div className="relative leading-[1.15] w-[600px] min-w-[600px] h-[314px] min-h-[314px] shadow-2xl rounded-lg overflow-hidden">
        <MetaImage
          tvl="$1.34 B"
          sevenDayChange="+3.45%"
          name={project?.name}
          icon={project?.slug && `/icons/${project.slug}.png`}
          apiEndpoint="/fakeTvl.json"
        />
      </div>
    </div>
  )
}

export const Project: Story<TemplateProps> = Template.bind({})
Project.args = {
  projectId: ProjectId('nova'),
}

export const Overview: Story<TemplateProps> = Template.bind({})
Overview.parameters = {
  controls: { hideNoControlsWarning: true },
}
