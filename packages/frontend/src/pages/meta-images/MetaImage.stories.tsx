import { Meta } from '@storybook/react'
import React, { useEffect } from 'react'

import { onlyDesktopModes } from '../../../.storybook/modes'
import { configureCharts } from '../../scripts/charts'
import { ActivityMetaImage } from './ActivityMetaImage'
import { DetailedTvlMetaImage } from './DetailedTvlMetaImage'
import { TvlMetaImage } from './TvlMetaImage'

const meta: Meta<typeof TvlMetaImage> = {
  title: 'Other/MetaImage',
  decorators: [
    (Story) => {
      useEffect(() => {
        configureCharts()
      })
      return <Story />
    },
  ],
  parameters: {
    chromatic: {
      modes: onlyDesktopModes,
    },
  },
}
export default meta

export const Overview = () => {
  return (
    <div className="meta flex items-center justify-center">
      <div className="relative h-[314px] min-h-[314px] w-[600px] min-w-[600px] overflow-hidden rounded-lg shadow-2xl">
        <TvlMetaImage
          tvl="$1.34 B"
          sevenDayChange="+3.45%"
          chartType={{ type: 'layer2-tvl' }}
          fake
        />
      </div>
    </div>
  )
}

export const ProjectOverview = () => {
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
          chartType={{ type: 'project-tvl', slug: project.display.slug }}
          fake
        />
      </div>
    </div>
  )
}

export const DetailedTvlOverview = () => {
  return (
    <div className="meta flex items-center justify-center">
      <div className="relative h-[314px] min-h-[314px] w-[600px] min-w-[600px] overflow-hidden rounded-lg shadow-2xl">
        <DetailedTvlMetaImage
          tvl="$1.34 B"
          sevenDayChange="+3.45%"
          chartType={{ type: 'layer2-detailed-tvl' }}
          fake
        />
      </div>
    </div>
  )
}

export const DetailedProjectOverview = () => {
  const project = {
    display: {
      name: 'Arbitrum One',
      slug: 'arbitrum',
    },
  }

  return (
    <div className="meta flex items-center justify-center">
      <div className="relative h-[314px] min-h-[314px] w-[600px] min-w-[600px] overflow-hidden rounded-lg shadow-2xl">
        <DetailedTvlMetaImage
          tvl="$1.34 B"
          sevenDayChange="+3.45%"
          name={project.display.name}
          icon={project.display.slug && `/icons/${project.display.slug}.png`}
          chartType={{
            type: 'project-detailed-tvl',
            slug: project.display.slug,
          }}
          fake
        />
      </div>
    </div>
  )
}

export const ActivityOverview = () => {
  return (
    <div className="meta flex items-center justify-center">
      <div className="relative h-[314px] min-h-[314px] w-[600px] min-w-[600px] overflow-hidden rounded-lg shadow-2xl">
        <ActivityMetaImage tpsDaily="15.69" tpsWeeklyChange="+3.45%" fake />
      </div>
    </div>
  )
}
