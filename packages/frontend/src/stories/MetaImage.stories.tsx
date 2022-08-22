import '../styles/meta-image.scss'

import { projects } from '@l2beat/config'
import { ProjectId } from '@l2beat/types'
import { Story } from '@storybook/react'
import React, { useEffect } from 'react'

import { MetaImage as MetaImageComponent } from '../pages/MetaImages/MetaImage'
import { configureChart } from '../scripts/chart'

export default {
  title: 'Components/MetaImage',
}

interface TemplateProps {
  projectId: ProjectId
}

function Template({ projectId }: TemplateProps) {
  useEffect(() => {
    configureChart()
  })
  const project = projects.find((x) => x.id === projectId)
  return (
    <MetaImageComponent
      tvl="$1.34 B"
      sevenDayChange="+3.45%"
      name={project?.name ?? 'Unknown'}
      icon={`/icons/${project?.slug ?? 'unknown'}.png`}
      apiEndpoint="/fakeTvl.json"
      metadata={{ description: '', image: '', title: '', url: '' }}
    />
  )
}
export const MetaImage: Story = Template.bind(
  {},
  {
    projectId: ProjectId('nova'),
  },
)
MetaImage.parameters = {
  controls: { hideNoControlsWarning: true },
  layout: 'fullscreen',
}
