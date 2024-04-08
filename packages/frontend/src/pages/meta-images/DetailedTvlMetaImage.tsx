import React from 'react'

import { Chart, Logo } from '../../components'
import { ChartType } from '../../scripts/charts/types'
import { cn } from '../../utils/cn'
import { MetaImageHeader } from './MetaImageHeader'

export interface DetailedTvlMetaImageProps {
  tvl: string
  sevenDayChange: string
  name?: string
  icon?: string
  chartType: Extract<
    ChartType,
    | { type: 'project-detailed-tvl' }
    | { type: 'scaling-detailed-tvl' }
    | { type: 'bridges-tvl' }
  >
  fake?: boolean
}

export function DetailedTvlMetaImage(props: DetailedTvlMetaImageProps) {
  const isProject = !!props.name
  const name = props.name ?? 'Overview'
  return (
    <div className="leading-[1.15]">
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
          props.fake ? { type: 'storybook-fake-detailed-tvl' } : props.chartType
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
