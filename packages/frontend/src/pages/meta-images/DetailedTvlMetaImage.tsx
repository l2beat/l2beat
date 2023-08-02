import cx from 'classnames'
import React from 'react'

import { Chart, Header, Logo } from '../../components'

export interface DetailedTvlMetaImageProps {
  tvl: string
  sevenDayChange: string
  name?: string
  icon?: string
  detailedTvlEndpoint: string
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
        detailedTvlEndpoint={props.detailedTvlEndpoint}
        type={'detailedTvl'}
        metaChart
      />
      <Logo />
    </div>
  )
}
