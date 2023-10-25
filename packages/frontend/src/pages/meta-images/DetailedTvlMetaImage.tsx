import cx from 'classnames'
import React from 'react'

import { Chart, Header, Logo } from '../../components'
import { ChartType } from '../../scripts/charts/types'

export interface DetailedTvlMetaImageProps {
  tvl: string
  sevenDayChange: string
  name?: string
  icon?: string
  chartType: Extract<
    ChartType,
    | { type: 'project-detailed-tvl' }
    | { type: 'layer2-detailed-tvl' }
    | { type: 'bridges-tvl' }
  >
  fake?: boolean
}

export function DetailedTvlMetaImage(props: DetailedTvlMetaImageProps) {
  const name = props.name ?? 'Overview'
  return (
    <div
      className={cx(
        'MetaImage leading-[1.15]',
        !props.name ? 'overview' : 'project',
      )}
    >
      <Header
        title={name}
        titleClassName={name.length > 12 ? '!text-5xl' : undefined}
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
      <Logo />
    </div>
  )
}
