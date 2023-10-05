import cx from 'classnames'
import React from 'react'

import { Chart, Header, Logo } from '../../components'
import { ChartType } from '../../scripts/charts/types'

export interface DetailedTvlMetaImageProps {
  tvl: string
  sevenDayChange: string
  name?: string
  icon?: string
  chartType: ChartType
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
      <Chart settingsId="meta" initialType={props.chartType} metaChart />
      <Logo />
    </div>
  )
}
