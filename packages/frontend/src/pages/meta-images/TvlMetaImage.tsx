import React from 'react'

import { Chart, Logo } from '../../components'
import { ChartType } from '../../scripts/charts/types'
import { cn } from '../../utils/cn'
import { MetaImageHeader } from './MetaImageHeader'

export interface TvlMetaImageProps {
  tvl: string
  sevenDayChange: string
  chartType: Extract<
    ChartType,
    { type: 'project-tvl' } | { type: 'layer2-tvl' } | { type: 'bridges-tvl' }
  >
  name?: string
  icon?: string
  fake?: boolean
}

export function TvlMetaImage(props: TvlMetaImageProps) {
  const isProject = !!props.name
  const name = props.name ?? 'Overview'

  return (
    <div className={cn('MetaImage', !props.name ? 'overview' : 'project')}>
      <MetaImageHeader
        title={name}
        isProject={isProject}
        icon={props.icon}
        tvl={props.tvl}
        tvlWeeklyChange={props.sevenDayChange}
      />
      <Chart
        settingsId="meta"
        initialType={
          props.fake ? { type: 'storybook-fake-tvl' } : props.chartType
        }
        metaChart
      />
      <Logo
        className={cn(
          isProject && 'absolute left-4 top-6',
          !isProject &&
            'absolute left-1/2 top-1/2 z-100 h-auto w-[250px] -translate-x-1/2 -translate-y-1/2',
        )}
        animated={false}
      />
    </div>
  )
}
