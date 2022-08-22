import cx from 'classnames'
import React from 'react'

import { Chart, Header, Logo } from '../../components'

export interface MetaImageProps {
  tvl: string
  sevenDayChange: string
  name?: string
  icon?: string
  apiEndpoint: string
}

export function MetaImage(props: MetaImageProps) {
  const name = props.name ?? 'Overview'

  return (
    <div className={cx('Meta', !props.name ? 'overview' : 'project')}>
      <Header
        title={name}
        titleClassName={name.length > 12 ? '!text-5xl' : undefined}
        icon={props.icon}
        tvl={props.tvl}
        sevenDayChange={props.sevenDayChange}
      />
      <Chart endpoint={props.apiEndpoint} days={30} />
      <Logo />
    </div>
  )
}
