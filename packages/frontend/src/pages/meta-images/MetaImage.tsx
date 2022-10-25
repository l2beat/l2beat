import cx from 'classnames'
import React from 'react'

import { Chart, Header, Logo } from '../../components'

export interface MetaImageProps {
  tvl: string
  sevenDayChange: string
  name?: string
  icon?: string
  tvlEndpoint: string
}

export function MetaImage(props: MetaImageProps) {
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
      <Chart tvlEndpoint={props.tvlEndpoint} metaChart />
      <Logo />
    </div>
  )
}

export interface ActivityMetaImageProps {
  tpsDaily: string
  tpsWeeklyChange: string
  activityEndpoint: string
  ethereumActivityEndpoint: string
}

export function ActivityMetaImage(props: ActivityMetaImageProps) {
  const name = 'Activity'

  return (
    <div className={'MetaImage leading-[1.15] overview'}>
      <Header
        showTps
        title={name}
        titleClassName={name.length > 12 ? '!text-5xl' : undefined}
        tpsDaily={props.tpsDaily}
        tpsWeeklyChange={props.tpsWeeklyChange}
      />
      <Chart
        type={'activity'}
        metaChart
        activityEndpoint={props.activityEndpoint}
        ethereumActivityEndpoint={props.ethereumActivityEndpoint}
        hasTvl={false}
        hasActivity
      />
      <Logo />
    </div>
  )
}
