import { Meta, StoryFn } from '@storybook/react'
import React, { useEffect } from 'react'

import { configureCharts } from '../../scripts/charts'
import { ActivityMetaImage } from './ActivityMetaImage'
import { DetailedTvlMetaImage } from './DetailedTvlMetaImage'
import { TvlMetaImage } from './TvlMetaImage'

export default {
  title: 'Other/MetaImage',
} as Meta

export function TvlOverview() {
  useEffect(() => {
    configureCharts()
  })

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

export function ProjectOverview() {
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
          chartType={{ type: 'project-tvl', slug: project.display.slug }}
          fake
        />
      </div>
    </div>
  )
}

export function DetailedTvlOverview() {
  useEffect(() => {
    configureCharts()
  })

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

export function DetailedProjectOverview() {
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

export const ActivityOverview: StoryFn = () => {
  useEffect(() => {
    configureCharts()
  })
  return (
    <div className="meta flex items-center justify-center">
      <div className="relative h-[314px] min-h-[314px] w-[600px] min-w-[600px] overflow-hidden rounded-lg shadow-2xl">
        <ActivityMetaImage tpsDaily="15.69" tpsWeeklyChange="+3.45%" fake />
      </div>
    </div>
  )
}
