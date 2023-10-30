import cx from 'classnames'
import React from 'react'

import { Chart, Header, Logo } from '../../components'
import { ChartType } from '../../scripts/charts/types'

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
          props.fake ? { type: 'storybook-fake-tvl' } : props.chartType
        }
        metaChart
      />
      <Logo />
    </div>
  )
}
